package com.mahbuobeh.tayyar;

import android.app.DownloadManager;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name = "TayyarMobileEngine")
public class TayyarMobilePlugin extends Plugin {
    private static final String TAG = "TayyarMobileEngine";

    private static class NativeDownloadTask {
        long id;
        String rawUrl;
        String filename;
        String referer;
        String mimeType;
        String savedPath = "";
        volatile String status = "downloading"; // downloading, completed, paused, error
        volatile long downloaded = 0;
        volatile long total = -1;
        volatile double speed = 0;
        volatile int percent = 0;
        volatile String errorMsg = "";
        AtomicBoolean cancelled = new AtomicBoolean(false);
    }

    private static final ConcurrentHashMap<Long, NativeDownloadTask> activeTasks = new ConcurrentHashMap<>();

    private String sanitizeFilename(String name, String url) {
        if (name == null || name.trim().isEmpty()) {
            name = "Tayyar_Media_" + System.currentTimeMillis();
        }
        String cleaned = name.replaceAll("[\\\\/:*?\"<>|\\r\\n]", "_").trim();
        if (cleaned.length() > 90) {
            int dotIdx = cleaned.lastIndexOf('.');
            if (dotIdx > 0 && cleaned.length() - dotIdx <= 6) {
                String ext = cleaned.substring(dotIdx);
                cleaned = cleaned.substring(0, 80) + ext;
            } else {
                cleaned = cleaned.substring(0, 85);
            }
        }
        if (!cleaned.contains(".")) {
            if (url != null && (url.contains(".mp3") || url.contains("audio"))) {
                cleaned += ".mp3";
            } else {
                cleaned += ".mp4";
            }
        }
        return cleaned;
    }

    private String getMimeTypeForName(String filename) {
        String lower = filename.toLowerCase();
        if (lower.endsWith(".mp4")) return "video/mp4";
        if (lower.endsWith(".mkv")) return "video/x-matroska";
        if (lower.endsWith(".webm")) return "video/webm";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".m4a")) return "audio/mp4";
        if (lower.endsWith(".wav")) return "audio/wav";
        if (lower.endsWith(".apk")) return "application/vnd.android.package-archive";
        if (lower.endsWith(".zip")) return "application/zip";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        return "application/octet-stream";
    }

    /**
     * Resolves social page URLs into direct stream URLs synchronously on the background thread
     * if the frontend passed a page URL instead of an extracted stream link.
     */
    private String resolveDirectMediaIfNeeded(String initialUrl, boolean isAudio) {
        try {
            String url = resolveRedirects(initialUrl);
            // Already a direct CDN media link
            if (url.contains("googlevideo.com") || url.contains("tikcdn.io") ||
                url.contains("cdninstagram.com") || url.contains("fbcdn.net") ||
                url.contains("v16-webapp") || url.contains(".mp4") || url.contains(".mp3") ||
                url.contains("tikwm.com/video/media")) {
                return url;
            }

            // TikTok direct resolution via TikWM
            if (url.contains("tiktok.com")) {
                try {
                    URL tikwmUrl = new URL("https://www.tikwm.com/api/?url=" + URLEncoder.encode(url, "UTF-8"));
                    HttpURLConnection conn = (HttpURLConnection) tikwmUrl.openConnection();
                    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 13; Mobile)");
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(12000);
                    if (conn.getResponseCode() == 200) {
                        StringBuilder sb = new StringBuilder();
                        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                            String line;
                            while ((line = reader.readLine()) != null) sb.append(line);
                        }
                        org.json.JSONObject obj = new org.json.JSONObject(sb.toString());
                        if (obj.optInt("code", -1) == 0 && obj.has("data")) {
                            org.json.JSONObject data = obj.getJSONObject("data");
                            String target = isAudio ? data.optString("music", "") : data.optString("play", "");
                            if (target.isEmpty()) target = data.optString("play", "");
                            if (!target.isEmpty()) {
                                if (!target.startsWith("http")) target = "https://www.tikwm.com" + target;
                                return target;
                            }
                        }
                    }
                } catch (Exception ignored) {}
            }

            // YouTube direct resolution via Piped
            if (url.contains("youtube.com") || url.contains("youtu.be")) {
                Pattern pYt = Pattern.compile("(?:watch\\?v=|shorts/|live/|youtu\\.be/)([a-zA-Z0-9_-]{11})");
                Matcher mYt = pYt.matcher(url);
                if (mYt.find()) {
                    String videoId = mYt.group(1);
                    String[] hosts = new String[] {
                        "https://api.piped.private.coffee/streams/",
                        "https://pipedapi.ducks.party/streams/"
                    };
                    for (String host : hosts) {
                        try {
                            URL pUrl = new URL(host + videoId);
                            HttpURLConnection conn = (HttpURLConnection) pUrl.openConnection();
                            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                            conn.setConnectTimeout(8000);
                            conn.setReadTimeout(12000);
                            if (conn.getResponseCode() == 200) {
                                StringBuilder jsonSb = new StringBuilder();
                                try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                                    String line;
                                    while ((line = reader.readLine()) != null) jsonSb.append(line);
                                }
                                org.json.JSONObject obj = new org.json.JSONObject(jsonSb.toString());
                                if (isAudio) {
                                    org.json.JSONArray aStreams = obj.optJSONArray("audioStreams");
                                    if (aStreams != null && aStreams.length() > 0 && aStreams.getJSONObject(0).has("url")) {
                                        return aStreams.getJSONObject(0).getString("url");
                                    }
                                } else {
                                    org.json.JSONArray fStreams = obj.optJSONArray("formatStreams");
                                    if (fStreams != null && fStreams.length() > 0 && fStreams.getJSONObject(0).has("url")) {
                                        return fStreams.getJSONObject(0).getString("url");
                                    }
                                    org.json.JSONArray vStreams = obj.optJSONArray("videoStreams");
                                    if (vStreams != null) {
                                        for (int i = 0; i < vStreams.length(); i++) {
                                            org.json.JSONObject v = vStreams.getJSONObject(i);
                                            if ("MP4".equalsIgnoreCase(v.optString("format", "")) && v.has("url")) {
                                                return v.getString("url");
                                            }
                                        }
                                    }
                                }
                            }
                        } catch (Exception ignored) {}
                    }
                }
            }

            // Instagram / Facebook / Snapchat OpenGraph scraper
            if (url.contains("instagram.com") || url.contains("facebook.com") || url.contains("fb.watch") || url.contains("snapchat.com")) {
                try {
                    URL target = new URL(url);
                    HttpURLConnection conn = (HttpURLConnection) target.openConnection();
                    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
                    conn.setConnectTimeout(8000);
                    conn.setReadTimeout(10000);
                    conn.setInstanceFollowRedirects(true);
                    if (conn.getResponseCode() == 200) {
                        StringBuilder htmlSb = new StringBuilder();
                        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                            String line;
                            while ((line = reader.readLine()) != null) {
                                htmlSb.append(line);
                                if (htmlSb.length() > 600000) break;
                            }
                        }
                        String html = htmlSb.toString();
                        Pattern pVid = Pattern.compile("<meta[^>]+property=[\"'](?:og:video|og:video:url|og:video:secure_url)[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);
                        Matcher mVid = pVid.matcher(html);
                        if (!mVid.find()) {
                            pVid = Pattern.compile("<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"'](?:og:video|og:video:url|og:video:secure_url)[\"']", Pattern.CASE_INSENSITIVE);
                            mVid = pVid.matcher(html);
                        }
                        if (!mVid.find()) {
                            pVid = Pattern.compile("\"(playable_url|playable_url_quality_hd|browser_native_hd_url|video_url)\":\"(https:[^\"\\\\]+)\"");
                            mVid = pVid.matcher(html);
                        }
                        if (mVid.find()) {
                            return (mVid.groupCount() >= 2 ? mVid.group(2) : mVid.group(1)).replace("\\/", "/").replace("&amp;", "&");
                        }
                    }
                } catch (Exception ignored) {}
            }

            return url;
        } catch (Exception e) {
            return initialUrl;
        }
    }

    @PluginMethod
    public void startDownload(PluginCall call) {
        try {
            String url = call.getString("url");
            if (url == null || url.trim().isEmpty()) {
                call.reject("URL cannot be empty");
                return;
            }
            url = url.trim();

            if (url.startsWith("magnet:") || url.contains(".torrent")) {
                call.reject("BitTorrent magnet links require torrent client support");
                return;
            }

            String rawFilename = call.getString("filename");
            final String safeFilename = sanitizeFilename(rawFilename, url);
            final String referer = call.getString("referer");
            final String mimeType = getMimeTypeForName(safeFilename);
            final boolean isAudio = safeFilename.toLowerCase().endsWith(".mp3") || safeFilename.toLowerCase().endsWith(".m4a");

            final long downloadId = System.currentTimeMillis();
            final NativeDownloadTask task = new NativeDownloadTask();
            task.id = downloadId;
            task.rawUrl = url;
            task.filename = safeFilename;
            task.referer = referer != null ? referer : "";
            task.mimeType = mimeType;
            activeTasks.put(downloadId, task);

            final Context context = getContext().getApplicationContext();

            new Thread(new Runnable() {
                @Override
                public void run() {
                    HttpURLConnection conn = null;
                    InputStream is = null;
                    OutputStream os = null;
                    Uri mediaStoreUri = null;
                    File directFile = null;

                    try {
                        // 1. Resolve social media page URL to real media stream if needed
                        String targetUrl = resolveDirectMediaIfNeeded(task.rawUrl, isAudio);

                        // 2. Open HTTP connection following all redirects
                        for (int hop = 0; hop < 8; hop++) {
                            URL u = new URL(targetUrl);
                            conn = (HttpURLConnection) u.openConnection();
                            conn.setInstanceFollowRedirects(false);
                            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");
                            conn.setRequestProperty("Accept", "*/*");
                            if (!task.referer.isEmpty()) {
                                conn.setRequestProperty("Referer", task.referer);
                            }
                            conn.setConnectTimeout(15000);
                            conn.setReadTimeout(30000);

                            int code = conn.getResponseCode();
                            if (code >= 300 && code < 400) {
                                String loc = conn.getHeaderField("Location");
                                conn.disconnect();
                                if (loc != null && !loc.isEmpty()) {
                                    if (loc.startsWith("/")) {
                                        loc = u.getProtocol() + "://" + u.getHost() + loc;
                                    }
                                    targetUrl = loc;
                                    continue;
                                }
                            }
                            if (code >= 400) {
                                throw new Exception("Server responded with HTTP " + code);
                            }
                            break;
                        }

                        if (conn == null) {
                            throw new Exception("Could not establish connection");
                        }

                        task.total = conn.getContentLengthLong();
                        is = conn.getInputStream();

                        // 3. Open output stream directly into public Downloads (Android 10+ MediaStore or Legacy File)
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            ContentResolver resolver = context.getContentResolver();
                            ContentValues values = new ContentValues();
                            values.put(MediaStore.Downloads.DISPLAY_NAME, task.filename);
                            values.put(MediaStore.Downloads.MIME_TYPE, task.mimeType);
                            values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Tayyar");
                            values.put(MediaStore.Downloads.IS_PENDING, 1);

                            mediaStoreUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                            if (mediaStoreUri != null) {
                                os = resolver.openOutputStream(mediaStoreUri);
                                task.savedPath = "Downloads/Tayyar/" + task.filename;
                            }
                        }

                        if (os == null) {
                            File pubDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                            File tayyarDir = new File(pubDir, "Tayyar");
                            if (!tayyarDir.exists()) tayyarDir.mkdirs();
                            if (!tayyarDir.canWrite()) {
                                tayyarDir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                                if (tayyarDir != null && !tayyarDir.exists()) tayyarDir.mkdirs();
                            }
                            directFile = new File(tayyarDir, task.filename);
                            int counter = 1;
                            while (directFile.exists()) {
                                int dot = task.filename.lastIndexOf('.');
                                String base = dot > 0 ? task.filename.substring(0, dot) : task.filename;
                                String ext = dot > 0 ? task.filename.substring(dot) : "";
                                directFile = new File(tayyarDir, base + "_" + counter + ext);
                                counter++;
                            }
                            os = new FileOutputStream(directFile);
                            task.savedPath = directFile.getAbsolutePath();
                        }

                        // 4. Stream download chunks with accurate progress and speed calculation
                        byte[] buffer = new byte[65536];
                        int read;
                        long lastTime = System.currentTimeMillis();
                        long lastBytes = 0;

                        while (!task.cancelled.get() && (read = is.read(buffer)) != -1) {
                            os.write(buffer, 0, read);
                            task.downloaded += read;

                            long now = System.currentTimeMillis();
                            long dt = now - lastTime;
                            if (dt >= 350) {
                                long db = task.downloaded - lastBytes;
                                task.speed = (db / (double) dt) * 1000.0;
                                if (task.total > 0) {
                                    task.percent = (int) Math.min(100, (task.downloaded * 100L) / task.total);
                                }
                                lastTime = now;
                                lastBytes = task.downloaded;
                            }
                        }

                        os.flush();

                        if (task.cancelled.get()) {
                            task.status = "paused";
                            if (mediaStoreUri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                try { context.getContentResolver().delete(mediaStoreUri, null, null); } catch (Exception ignored) {}
                            }
                            if (directFile != null && directFile.exists()) {
                                directFile.delete();
                            }
                        } else {
                            if (mediaStoreUri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                ContentValues doneVals = new ContentValues();
                                doneVals.put(MediaStore.Downloads.IS_PENDING, 0);
                                context.getContentResolver().update(mediaStoreUri, doneVals, null, null);
                            }
                            if (directFile != null) {
                                MediaScannerConnection.scanFile(
                                    context,
                                    new String[]{ directFile.getAbsolutePath() },
                                    new String[]{ task.mimeType },
                                    null
                                );
                            }
                            task.status = "completed";
                            task.percent = 100;
                            task.speed = 0;
                            if (task.total <= 0) task.total = task.downloaded;
                            Log.i(TAG, "Native download complete: " + task.savedPath + " (" + task.downloaded + " bytes)");
                        }
                    } catch (Exception ex) {
                        Log.e(TAG, "Native download failed", ex);
                        task.status = "error";
                        task.errorMsg = ex.getMessage() != null ? ex.getMessage() : "Download error";
                        if (mediaStoreUri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            try { context.getContentResolver().delete(mediaStoreUri, null, null); } catch (Exception ignored) {}
                        }
                    } finally {
                        try { if (is != null) is.close(); } catch (Exception ignored) {}
                        try { if (os != null) os.close(); } catch (Exception ignored) {}
                        try { if (conn != null) conn.disconnect(); } catch (Exception ignored) {}
                    }
                }
            }).start();

            JSObject ret = new JSObject();
            ret.put("ok", true);
            ret.put("downloadId", downloadId);
            ret.put("filename", safeFilename);
            ret.put("url", url);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error starting native download", e);
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void queryDownload(PluginCall call) {
        try {
            Long downloadId = call.getLong("downloadId");
            if (downloadId == null) {
                call.reject("downloadId required");
                return;
            }

            NativeDownloadTask task = activeTasks.get(downloadId);
            if (task != null) {
                JSObject ret = new JSObject();
                ret.put("downloadId", task.id);
                ret.put("downloaded", task.downloaded);
                ret.put("total", task.total);
                ret.put("speed", task.speed);
                ret.put("percent", task.percent);
                ret.put("status", task.status);
                ret.put("path", task.savedPath);
                ret.put("error", task.errorMsg);
                call.resolve(ret);
                return;
            }

            // Fallback query to Android system DownloadManager if ID belongs to it
            Context context = getContext();
            DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Query query = new DownloadManager.Query();
            query.setFilterById(downloadId);

            Cursor c = dm.query(query);
            JSObject ret = new JSObject();

            if (c != null && c.moveToFirst()) {
                int bytesDownloadedIdx = c.getColumnIndex(DownloadManager.COLUMN_BYTES_DOWNLOADED_SO_FAR);
                int totalBytesIdx = c.getColumnIndex(DownloadManager.COLUMN_TOTAL_SIZE_BYTES);
                int statusIdx = c.getColumnIndex(DownloadManager.COLUMN_STATUS);

                long downloaded = bytesDownloadedIdx >= 0 ? c.getLong(bytesDownloadedIdx) : 0;
                long total = totalBytesIdx >= 0 ? c.getLong(totalBytesIdx) : -1;
                int status = statusIdx >= 0 ? c.getInt(statusIdx) : 0;

                String statusStr = "downloading";
                if (status == DownloadManager.STATUS_SUCCESSFUL) {
                    statusStr = "completed";
                } else if (status == DownloadManager.STATUS_FAILED) {
                    statusStr = "error";
                } else if (status == DownloadManager.STATUS_PAUSED) {
                    statusStr = "paused";
                } else if (status == DownloadManager.STATUS_PENDING) {
                    statusStr = "queued";
                }

                ret.put("downloadId", downloadId);
                ret.put("downloaded", downloaded);
                ret.put("total", total);
                ret.put("status", statusStr);
                c.close();
            } else {
                if (c != null) c.close();
                ret.put("status", "unknown");
            }

            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error querying download", e);
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void cancelDownload(PluginCall call) {
        try {
            Long downloadId = call.getLong("downloadId");
            if (downloadId != null) {
                NativeDownloadTask task = activeTasks.remove(downloadId);
                if (task != null) {
                    task.cancelled.set(true);
                } else {
                    DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
                    dm.remove(downloadId);
                }
            }
            JSObject ret = new JSObject();
            ret.put("ok", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    private String resolveRedirects(String initialUrl) {
        try {
            String current = initialUrl;
            for (int i = 0; i < 5; i++) {
                URL u = new URL(current);
                HttpURLConnection conn = (HttpURLConnection) u.openConnection();
                conn.setInstanceFollowRedirects(false);
                conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
                conn.setConnectTimeout(6000);
                conn.setReadTimeout(6000);
                int code = conn.getResponseCode();
                if (code >= 300 && code < 400) {
                    String loc = conn.getHeaderField("Location");
                    if (loc != null && !loc.isEmpty()) {
                        if (loc.startsWith("/")) {
                            loc = u.getProtocol() + "://" + u.getHost() + loc;
                        }
                        current = loc;
                        continue;
                    }
                }
                break;
            }
            return current;
        } catch (Exception e) {
            return initialUrl;
        }
    }

    @PluginMethod
    public void resolveSocialUrl(PluginCall call) {
        final String rawUrl = call.getString("url");
        if (rawUrl == null || rawUrl.trim().isEmpty()) {
            call.reject("URL cannot be empty");
            return;
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    final String url = resolveRedirects(rawUrl.trim());

                    // 1. TikTok No-Watermark Resolution (TikWM + SSSTik mirror via native HTTP - zero CORS)
                    if (url.contains("tiktok.com")) {
                        try {
                            URL tikwmUrl = new URL("https://www.tikwm.com/api/?url=" + URLEncoder.encode(url, "UTF-8"));
                            HttpURLConnection conn = (HttpURLConnection) tikwmUrl.openConnection();
                            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Linux; Android 13; Mobile)");
                            conn.setConnectTimeout(6000);
                            conn.setReadTimeout(10000);
                            if (conn.getResponseCode() == 200) {
                                StringBuilder sb = new StringBuilder();
                                try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                                    String line;
                                    while ((line = reader.readLine()) != null) sb.append(line);
                                }
                                org.json.JSONObject obj = new org.json.JSONObject(sb.toString());
                                if (obj.optInt("code", -1) == 0 && obj.has("data")) {
                                    org.json.JSONObject data = obj.getJSONObject("data");
                                    String play = data.optString("play", "");
                                    if (!play.isEmpty()) {
                                        if (!play.startsWith("http")) play = "https://www.tikwm.com" + play;
                                        JSArray formats = new JSArray();
                                        JSObject f1 = new JSObject();
                                        f1.put("id", "nowm");
                                        f1.put("quality", "⚡ فيديو أصلي فائق الدقة بدون علامة مائية (MP4)");
                                        f1.put("ext", "mp4");
                                        f1.put("url", play);
                                        f1.put("directUrl", play);
                                        formats.put(f1);

                                        String music = data.optString("music", "");
                                        if (!music.isEmpty()) {
                                            if (!music.startsWith("http")) music = "https://www.tikwm.com" + music;
                                            JSObject fMusic = new JSObject();
                                            fMusic.put("id", "audio");
                                            fMusic.put("quality", "🎵 ملف صوتي فقط (MP3)");
                                            fMusic.put("ext", "mp3");
                                            fMusic.put("url", music);
                                            fMusic.put("directUrl", music);
                                            formats.put(fMusic);
                                        }

                                        JSObject ret = new JSObject();
                                        ret.put("ok", true);
                                        ret.put("platform", "TikTok");
                                        ret.put("title", data.optString("title", "TikTok Video"));
                                        ret.put("thumbnail", data.optString("cover", ""));
                                        ret.put("formats", formats);
                                        call.resolve(ret);
                                        return;
                                    }
                                }
                            }
                        } catch (Exception ex) {
                            Log.w(TAG, "TikWM resolution failed: " + ex.getMessage());
                        }

                        try {
                            URL ssstikUrl = new URL("https://ssstik.io/abc?url=dl");
                            HttpURLConnection conn = (HttpURLConnection) ssstikUrl.openConnection();
                            conn.setRequestMethod("POST");
                            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
                            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36");
                            conn.setRequestProperty("Origin", "https://ssstik.io");
                            conn.setRequestProperty("Referer", "https://ssstik.io/en");
                            conn.setConnectTimeout(10000);
                            conn.setReadTimeout(15000);
                            conn.setDoOutput(true);

                            String postData = "id=" + URLEncoder.encode(url, "UTF-8") + "&locale=en&tt=";
                            try (OutputStream os = conn.getOutputStream()) {
                                os.write(postData.getBytes("UTF-8"));
                            }

                            StringBuilder htmlSb = new StringBuilder();
                            try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                                String line;
                                while ((line = reader.readLine()) != null) {
                                    htmlSb.append(line);
                                }
                            }
                            String html = htmlSb.toString();

                            Pattern p = Pattern.compile("href=\"(https://tikcdn\\.io/ssstik/[^\"]+)\"");
                            Matcher m = p.matcher(html);
                            JSArray formats = new JSArray();
                            if (m.find()) {
                                JSObject f1 = new JSObject();
                                f1.put("id", "nowm");
                                f1.put("quality", "⚡ فيديو أصلي فائق الدقة بدون علامة مائية (MP4)");
                                f1.put("ext", "mp4");
                                f1.put("url", m.group(1));
                                f1.put("directUrl", m.group(1));
                                f1.put("referer", "https://ssstik.io/");
                                formats.put(f1);
                            }
                            if (m.find()) {
                                JSObject f2 = new JSObject();
                                f2.put("id", "hd");
                                f2.put("quality", "🎬 جودة فائقة HD بدون علامة مائية (MP4)");
                                f2.put("ext", "mp4");
                                f2.put("url", m.group(1));
                                f2.put("directUrl", m.group(1));
                                f2.put("referer", "https://ssstik.io/");
                                formats.put(f2);
                            }

                            Pattern pAudio = Pattern.compile("href=\"(https://tikcdn\\.io/ssstik/mp3/[^\"]+)\"");
                            Matcher mAudio = pAudio.matcher(html);
                            if (mAudio.find()) {
                                JSObject fAudio = new JSObject();
                                fAudio.put("id", "audio");
                                fAudio.put("quality", "🎵 ملف صوتي فقط (MP3)");
                                fAudio.put("ext", "mp3");
                                fAudio.put("url", mAudio.group(1));
                                fAudio.put("directUrl", mAudio.group(1));
                                fAudio.put("referer", "https://ssstik.io/");
                                formats.put(fAudio);
                            }

                            if (formats.length() > 0) {
                                String title = "TikTok Video";
                                Pattern pTitle = Pattern.compile("<p class=\"maintext\">(.*?)</p>");
                                Matcher mTitle = pTitle.matcher(html);
                                if (mTitle.find()) {
                                    title = mTitle.group(1).replaceAll("<[^>]+>", "").trim();
                                }

                                JSObject ret = new JSObject();
                                ret.put("ok", true);
                                ret.put("platform", "TikTok");
                                ret.put("title", title);
                                ret.put("formats", formats);
                                call.resolve(ret);
                                return;
                            }
                        } catch (Exception ex) {
                            Log.w(TAG, "TikTok SSSTik resolution failed: " + ex.getMessage());
                        }
                    }

                    // 2. YouTube Resolution via Piped & Invidious APIs
                    if (url.contains("youtube.com") || url.contains("youtu.be")) {
                        Pattern pYt = Pattern.compile("(?:watch\\?v=|shorts/|live/|youtu\\.be/)([a-zA-Z0-9_-]{11})");
                        Matcher mYt = pYt.matcher(url);
                        if (mYt.find()) {
                            String videoId = mYt.group(1);
                            String[] pipedHosts = new String[] {
                                "https://api.piped.private.coffee/streams/",
                                "https://pipedapi.ducks.party/streams/"
                            };
                            for (String host : pipedHosts) {
                                try {
                                    URL pUrl = new URL(host + videoId);
                                    HttpURLConnection conn = (HttpURLConnection) pUrl.openConnection();
                                    conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
                                    conn.setConnectTimeout(8000);
                                    conn.setReadTimeout(12000);

                                    if (conn.getResponseCode() == 200) {
                                        StringBuilder jsonSb = new StringBuilder();
                                        try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                                            String line;
                                            while ((line = reader.readLine()) != null) jsonSb.append(line);
                                        }
                                        org.json.JSONObject obj = new org.json.JSONObject(jsonSb.toString());
                                        String title = obj.optString("title", "YouTube Video");
                                        JSArray formats = new JSArray();

                                        // 1. Progressive streams with audio+video (formatStreams)
                                        org.json.JSONArray fStreams = obj.optJSONArray("formatStreams");
                                        if (fStreams != null && fStreams.length() > 0) {
                                            for (int i = 0; i < fStreams.length(); i++) {
                                                org.json.JSONObject fObj = fStreams.getJSONObject(i);
                                                if (fObj.has("url")) {
                                                    JSObject fmt = new JSObject();
                                                    String q = fObj.optString("qualityLabel", "HD");
                                                    fmt.put("id", q);
                                                    fmt.put("quality", "🎬 فيديو بدقة عالية متكامل مع الصوت " + q + " (MP4)");
                                                    fmt.put("ext", "mp4");
                                                    fmt.put("url", fObj.getString("url"));
                                                    fmt.put("directUrl", fObj.getString("url"));
                                                    formats.put(fmt);
                                                }
                                            }
                                        }

                                        org.json.JSONArray vStreams = obj.optJSONArray("videoStreams");
                                        if (formats.length() == 0 && vStreams != null) {
                                            for (int i = 0; i < vStreams.length(); i++) {
                                                org.json.JSONObject v = vStreams.getJSONObject(i);
                                                String fmtStr = v.optString("format", "");
                                                boolean isMp4 = "MP4".equalsIgnoreCase(fmtStr) || "MPEG_4".equalsIgnoreCase(fmtStr);
                                                if (isMp4 && v.has("url")) {
                                                    JSObject fmt = new JSObject();
                                                    String q = v.optString("quality", "HD");
                                                    fmt.put("id", q);
                                                    fmt.put("quality", "🎬 فيديو بدقة " + q + " (MP4)");
                                                    fmt.put("ext", "mp4");
                                                    fmt.put("url", v.getString("url"));
                                                    fmt.put("directUrl", v.getString("url"));
                                                    formats.put(fmt);
                                                }
                                            }
                                        }
                                        org.json.JSONArray aStreams = obj.optJSONArray("audioStreams");
                                        if (aStreams != null && aStreams.length() > 0) {
                                            org.json.JSONObject a = aStreams.getJSONObject(0);
                                            if (a.has("url")) {
                                                JSObject fmt = new JSObject();
                                                fmt.put("id", "audio");
                                                fmt.put("quality", "🎵 ملف صوتي فقط (Audio Stream)");
                                                fmt.put("ext", "m4a");
                                                fmt.put("url", a.getString("url"));
                                                fmt.put("directUrl", a.getString("url"));
                                                formats.put(fmt);
                                            }
                                        }
                                        if (formats.length() > 0) {
                                            JSObject ret = new JSObject();
                                            ret.put("ok", true);
                                            ret.put("platform", "YouTube");
                                            ret.put("title", title);
                                            ret.put("thumbnail", obj.optString("thumbnailUrl", ""));
                                            ret.put("formats", formats);
                                            call.resolve(ret);
                                            return;
                                        }
                                    }
                                } catch (Exception ignored) {}
                            }
                        }
                    }

                    // 3. Instagram / Facebook / Snapchat / OpenGraph Native Scraper
                    if (url.contains("instagram.com") || url.contains("facebook.com") || url.contains("fb.watch") || url.contains("snapchat.com")) {
                        try {
                            URL target = new URL(url);
                            HttpURLConnection conn = (HttpURLConnection) target.openConnection();
                            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
                            conn.setConnectTimeout(8000);
                            conn.setReadTimeout(10000);
                            conn.setInstanceFollowRedirects(true);

                            if (conn.getResponseCode() == 200) {
                                StringBuilder htmlSb = new StringBuilder();
                                try (BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                                    String line;
                                    while ((line = reader.readLine()) != null) {
                                        htmlSb.append(line);
                                        if (htmlSb.length() > 600000) break;
                                    }
                                }
                                String html = htmlSb.toString();
                                Pattern pVid = Pattern.compile("<meta[^>]+property=[\"'](?:og:video|og:video:url|og:video:secure_url)[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE);
                                Matcher mVid = pVid.matcher(html);
                                if (!mVid.find()) {
                                    pVid = Pattern.compile("<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"'](?:og:video|og:video:url|og:video:secure_url)[\"']", Pattern.CASE_INSENSITIVE);
                                    mVid = pVid.matcher(html);
                                }
                                if (!mVid.find()) {
                                    pVid = Pattern.compile("\"(playable_url|playable_url_quality_hd|browser_native_hd_url|video_url)\":\"(https:[^\"\\\\]+)\"");
                                    mVid = pVid.matcher(html);
                                }
                                if (mVid.find()) {
                                    String videoUrl = (mVid.groupCount() >= 2 ? mVid.group(2) : mVid.group(1)).replace("\\/", "/").replace("&amp;", "&");
                                    String platName = url.contains("instagram.com") ? "Instagram" : (url.contains("snapchat.com") ? "Snapchat" : "Facebook");
                                    JSArray formats = new JSArray();
                                    JSObject fmt = new JSObject();
                                    fmt.put("id", "direct");
                                    fmt.put("quality", "🎬 فيديو مباشر عالي الدقة (MP4)");
                                    fmt.put("ext", "mp4");
                                    fmt.put("url", videoUrl);
                                    formats.put(fmt);

                                    JSObject ret = new JSObject();
                                    ret.put("ok", true);
                                    ret.put("platform", platName);
                                    ret.put("title", platName + " Video");
                                    ret.put("formats", formats);
                                    call.resolve(ret);
                                    return;
                                }
                            }
                        } catch (Exception ignored) {}
                    }

                    // Guaranteed universal fallback: return direct stream so download continues without blocking
                    JSArray fallbackFormats = new JSArray();
                    JSObject fFallback = new JSObject();
                    fFallback.put("id", "direct");
                    fFallback.put("quality", "🎬 تحميل البث المباشر (Direct MP4)");
                    fFallback.put("ext", "mp4");
                    fFallback.put("url", url);
                    fFallback.put("directUrl", url);
                    fallbackFormats.put(fFallback);

                    JSObject fallbackRet = new JSObject();
                    fallbackRet.put("ok", true);
                    fallbackRet.put("platform", "Media");
                    fallbackRet.put("title", "Media_Video");
                    fallbackRet.put("formats", fallbackFormats);
                    call.resolve(fallbackRet);
                } catch (Exception e) {
                    Log.e(TAG, "resolveSocialUrl error", e);
                    JSArray fallbackFormats = new JSArray();
                    JSObject fFallback = new JSObject();
                    fFallback.put("id", "direct");
                    fFallback.put("quality", "🎬 تحميل البث المباشر (Direct MP4)");
                    fFallback.put("ext", "mp4");
                    fFallback.put("url", rawUrl);
                    fFallback.put("directUrl", rawUrl);
                    fallbackFormats.put(fFallback);

                    JSObject fallbackRet = new JSObject();
                    fallbackRet.put("ok", true);
                    fallbackRet.put("platform", "Media");
                    fallbackRet.put("title", "Media_Video");
                    fallbackRet.put("formats", fallbackFormats);
                    call.resolve(fallbackRet);
                }
            }
        }).start();
    }
}
