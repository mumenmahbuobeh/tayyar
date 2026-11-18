package com.mahbuobeh.tayyar;

import android.app.Activity;
import android.app.DownloadManager;
import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.MediaMetadataRetriever;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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

    /* ==================== WHATSAPP STATUS SAVER (ANDROID NATIVE + SAF) ==================== */

    private static final String PREFS_WA = "tayyar_wa_status_prefs";
    private static final String KEY_WA_URI = "wa_tree_uri";
    private static final String KEY_WA_BIZ_URI = "wa_biz_tree_uri";

    private static class WaStatusEntry {
        String id;
        String name;
        String type; // "video" or "image"
        long size;
        long modified;
        String uri;
        String path;
        String source; // "WhatsApp" or "WhatsApp Business"
        String thumbnail;
    }

    @PluginMethod
    public void requestWhatsAppStatusAccess(PluginCall call) {
        try {
            boolean isBusiness = Boolean.TRUE.equals(call.getBoolean("business", false));
            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                String docId = isBusiness
                    ? "primary:Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses"
                    : "primary:Android/media/com.whatsapp/WhatsApp/Media/.Statuses";
                Uri initialUri = DocumentsContract.buildDocumentUri(
                    "com.android.externalstorage.documents",
                    docId
                );
                intent.putExtra(DocumentsContract.EXTRA_INITIAL_URI, initialUri);
            }

            call.setKeepAlive(true);
            startActivityForResult(call, intent, "handleWhatsAppFolderResult");
        } catch (Exception e) {
            Log.e(TAG, "requestWhatsAppStatusAccess error", e);
            call.reject("Could not open folder picker: " + e.getMessage());
        }
    }

    @ActivityCallback
    private void handleWhatsAppFolderResult(PluginCall call, ActivityResult result) {
        if (call == null) return;
        try {
            if (result.getResultCode() == Activity.RESULT_OK && result.getData() != null) {
                Uri treeUri = result.getData().getData();
                if (treeUri != null) {
                    int flags = result.getData().getFlags() & Intent.FLAG_GRANT_READ_URI_PERMISSION;
                    if (flags == 0) flags = Intent.FLAG_GRANT_READ_URI_PERMISSION;
                    try {
                        getContext().getContentResolver().takePersistableUriPermission(treeUri, flags);
                    } catch (Exception ignored) {}

                    boolean isBusiness = Boolean.TRUE.equals(call.getBoolean("business", false)) ||
                        treeUri.toString().toLowerCase().contains("w4b") ||
                        treeUri.toString().toLowerCase().contains("business");
                    SharedPreferences prefs = getContext().getSharedPreferences(PREFS_WA, Context.MODE_PRIVATE);
                    prefs.edit().putString(isBusiness ? KEY_WA_BIZ_URI : KEY_WA_URI, treeUri.toString()).apply();

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("granted", true);
                    ret.put("uri", treeUri.toString());
                    call.resolve(ret);
                    return;
                }
            }
            JSObject ret = new JSObject();
            ret.put("ok", false);
            ret.put("granted", false);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    private String makeThumbnailDataUrl(Context context, Uri contentUri, File file, boolean isVideo) {
        Bitmap bmp = null;
        try {
            if (isVideo) {
                MediaMetadataRetriever mmr = new MediaMetadataRetriever();
                try {
                    if (contentUri != null) {
                        mmr.setDataSource(context, contentUri);
                    } else if (file != null) {
                        mmr.setDataSource(file.getAbsolutePath());
                    }
                    bmp = mmr.getFrameAtTime(0, MediaMetadataRetriever.OPTION_CLOSEST_SYNC);
                } finally {
                    try { mmr.release(); } catch (Exception ignored) {}
                }
            } else {
                BitmapFactory.Options opts = new BitmapFactory.Options();
                opts.inSampleSize = 4;
                if (contentUri != null) {
                    try (InputStream is = context.getContentResolver().openInputStream(contentUri)) {
                        if (is != null) bmp = BitmapFactory.decodeStream(is, null, opts);
                    }
                } else if (file != null) {
                    bmp = BitmapFactory.decodeFile(file.getAbsolutePath(), opts);
                }
            }

            if (bmp != null) {
                int maxDim = 220;
                int w = bmp.getWidth();
                int h = bmp.getHeight();
                if (w > maxDim || h > maxDim) {
                    float scale = Math.min((float) maxDim / w, (float) maxDim / h);
                    Bitmap scaled = Bitmap.createScaledBitmap(bmp, Math.max(1, Math.round(w * scale)), Math.max(1, Math.round(h * scale)), true);
                    if (scaled != bmp) bmp.recycle();
                    bmp = scaled;
                }
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                bmp.compress(Bitmap.CompressFormat.JPEG, 68, baos);
                bmp.recycle();
                return "data:image/jpeg;base64," + Base64.encodeToString(baos.toByteArray(), Base64.NO_WRAP);
            }
        } catch (Exception ignored) {
            if (bmp != null && !bmp.isRecycled()) bmp.recycle();
        }
        return "";
    }

    private boolean isStatusMediaName(String name) {
        if (name == null || name.startsWith(".")) return false;
        String low = name.toLowerCase();
        return low.endsWith(".jpg") || low.endsWith(".jpeg") || low.endsWith(".png") ||
               low.endsWith(".webp") || low.endsWith(".mp4");
    }

    @PluginMethod
    public void listWhatsAppStatuses(PluginCall call) {
        final Context context = getContext().getApplicationContext();
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    List<WaStatusEntry> found = new ArrayList<>();
                    Set<String> seenNames = new HashSet<>();
                    boolean hasSafPermission = false;

                    SharedPreferences prefs = context.getSharedPreferences(PREFS_WA, Context.MODE_PRIVATE);
                    String[] safKeys = new String[] { KEY_WA_URI, KEY_WA_BIZ_URI };
                    String[] safLabels = new String[] { "WhatsApp", "WhatsApp Business" };

                    // 1. Scan persisted SAF tree URIs (Android 11+ standard path)
                    for (int k = 0; k < safKeys.length; k++) {
                        String uriStr = prefs.getString(safKeys[k], null);
                        if (uriStr == null || uriStr.isEmpty()) continue;
                        try {
                            Uri treeUri = Uri.parse(uriStr);
                            String docId = DocumentsContract.getTreeDocumentId(treeUri);
                            Uri childrenUri = DocumentsContract.buildChildDocumentsUriUsingTree(treeUri, docId);
                            String[] projection = new String[] {
                                DocumentsContract.Document.COLUMN_DOCUMENT_ID,
                                DocumentsContract.Document.COLUMN_DISPLAY_NAME,
                                DocumentsContract.Document.COLUMN_SIZE,
                                DocumentsContract.Document.COLUMN_LAST_MODIFIED
                            };
                            try (Cursor cursor = context.getContentResolver().query(childrenUri, projection, null, null, null)) {
                                if (cursor != null) {
                                    hasSafPermission = true;
                                    while (cursor.moveToNext()) {
                                        String childId = cursor.getString(0);
                                        String name = cursor.getString(1);
                                        long size = cursor.isNull(2) ? 0 : cursor.getLong(2);
                                        long modified = cursor.isNull(3) ? 0 : cursor.getLong(3);
                                        if (!isStatusMediaName(name) || seenNames.contains(name)) continue;
                                        seenNames.add(name);
                                        Uri docUri = DocumentsContract.buildDocumentUriUsingTree(treeUri, childId);
                                        WaStatusEntry entry = new WaStatusEntry();
                                        entry.id = "wa_saf_" + Math.abs(name.hashCode());
                                        entry.name = name;
                                        entry.type = name.toLowerCase().endsWith(".mp4") ? "video" : "image";
                                        entry.size = size;
                                        entry.modified = modified;
                                        entry.uri = docUri.toString();
                                        entry.path = "";
                                        entry.source = safLabels[k];
                                        found.add(entry);
                                    }
                                }
                            }
                        } catch (Exception ex) {
                            Log.w(TAG, "SAF scan warning: " + ex.getMessage());
                        }
                    }

                    // 2. Scan direct filesystem paths (Android 10 and below + devices allowing direct media read)
                    File extRoot = Environment.getExternalStorageDirectory();
                    if (extRoot != null) {
                        String[][] dirs = new String[][] {
                            { "Android/media/com.whatsapp/WhatsApp/Media/.Statuses", "WhatsApp" },
                            { "WhatsApp/Media/.Statuses", "WhatsApp" },
                            { "Android/media/com.whatsapp.w4b/WhatsApp Business/Media/.Statuses", "WhatsApp Business" },
                            { "WhatsApp Business/Media/.Statuses", "WhatsApp Business" }
                        };
                        for (String[] pair : dirs) {
                            File dir = new File(extRoot, pair[0]);
                            if (dir.exists() && dir.isDirectory() && dir.canRead()) {
                                File[] files = dir.listFiles();
                                if (files != null) {
                                    for (File f : files) {
                                        if (!f.isFile()) continue;
                                        String name = f.getName();
                                        if (!isStatusMediaName(name) || seenNames.contains(name)) continue;
                                        seenNames.add(name);
                                        WaStatusEntry entry = new WaStatusEntry();
                                        entry.id = "wa_fs_" + Math.abs(name.hashCode());
                                        entry.name = name;
                                        entry.type = name.toLowerCase().endsWith(".mp4") ? "video" : "image";
                                        entry.size = f.length();
                                        entry.modified = f.lastModified();
                                        entry.uri = "";
                                        entry.path = f.getAbsolutePath();
                                        entry.source = pair[1];
                                        found.add(entry);
                                    }
                                }
                            }
                        }
                    }

                    // Sort newest first & cap at 48 items for smooth rendering
                    Collections.sort(found, new Comparator<WaStatusEntry>() {
                        @Override
                        public int compare(WaStatusEntry a, WaStatusEntry b) {
                            return Long.compare(b.modified, a.modified);
                        }
                    });
                    if (found.size() > 48) {
                        found = found.subList(0, 48);
                    }

                    JSArray arr = new JSArray();
                    for (WaStatusEntry e : found) {
                        Uri u = (e.uri != null && !e.uri.isEmpty()) ? Uri.parse(e.uri) : null;
                        File f = (e.path != null && !e.path.isEmpty()) ? new File(e.path) : null;
                        e.thumbnail = makeThumbnailDataUrl(context, u, f, "video".equals(e.type));

                        JSObject obj = new JSObject();
                        obj.put("id", e.id);
                        obj.put("name", e.name);
                        obj.put("type", e.type);
                        obj.put("size", e.size);
                        obj.put("modified", e.modified);
                        obj.put("uri", e.uri);
                        obj.put("path", e.path);
                        obj.put("source", e.source);
                        obj.put("thumbnail", e.thumbnail);
                        arr.put(obj);
                    }

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("hasPermission", hasSafPermission || found.size() > 0);
                    ret.put("needsSaf", Build.VERSION.SDK_INT >= Build.VERSION_CODES.R && !hasSafPermission && found.size() == 0);
                    ret.put("items", arr);
                    call.resolve(ret);
                } catch (Exception e) {
                    Log.e(TAG, "listWhatsAppStatuses error", e);
                    call.reject(e.getMessage());
                }
            }
        }).start();
    }

    @PluginMethod
    public void saveWhatsAppStatus(PluginCall call) {
        final String uriStr = call.getString("uri", "");
        final String filePath = call.getString("path", "");
        final String rawName = call.getString("name", "WhatsApp_Status_" + System.currentTimeMillis() + ".jpg");
        final Context context = getContext().getApplicationContext();

        new Thread(new Runnable() {
            @Override
            public void run() {
                InputStream is = null;
                OutputStream os = null;
                Uri mediaStoreUri = null;
                File directFile = null;
                try {
                    if (uriStr != null && !uriStr.isEmpty()) {
                        is = context.getContentResolver().openInputStream(Uri.parse(uriStr));
                    } else if (filePath != null && !filePath.isEmpty()) {
                        is = new FileInputStream(new File(filePath));
                    }
                    if (is == null) {
                        call.reject("Could not read WhatsApp status file");
                        return;
                    }

                    String safeName = sanitizeFilename("WA_" + rawName, rawName);
                    String mimeType = getMimeTypeForName(safeName);
                    String savedPath = "";

                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        ContentResolver resolver = context.getContentResolver();
                        ContentValues values = new ContentValues();
                        values.put(MediaStore.Downloads.DISPLAY_NAME, safeName);
                        values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
                        values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Tayyar/Stories");
                        values.put(MediaStore.Downloads.IS_PENDING, 1);

                        mediaStoreUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                        if (mediaStoreUri != null) {
                            os = resolver.openOutputStream(mediaStoreUri);
                            savedPath = "Downloads/Tayyar/Stories/" + safeName;
                        }
                    }

                    if (os == null) {
                        File pubDir = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS);
                        File storyDir = new File(new File(pubDir, "Tayyar"), "Stories");
                        if (!storyDir.exists()) storyDir.mkdirs();
                        directFile = new File(storyDir, safeName);
                        os = new FileOutputStream(directFile);
                        savedPath = directFile.getAbsolutePath();
                    }

                    byte[] buf = new byte[32768];
                    int read;
                    long totalBytes = 0;
                    while ((read = is.read(buf)) != -1) {
                        os.write(buf, 0, read);
                        totalBytes += read;
                    }
                    os.flush();

                    if (mediaStoreUri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                        ContentValues doneVals = new ContentValues();
                        doneVals.put(MediaStore.Downloads.IS_PENDING, 0);
                        context.getContentResolver().update(mediaStoreUri, doneVals, null, null);
                    }
                    if (directFile != null) {
                        MediaScannerConnection.scanFile(
                            context,
                            new String[] { directFile.getAbsolutePath() },
                            new String[] { mimeType },
                            null
                        );
                    }

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("filename", safeName);
                    ret.put("path", savedPath);
                    ret.put("size", totalBytes);
                    call.resolve(ret);
                } catch (Exception e) {
                    Log.e(TAG, "saveWhatsAppStatus error", e);
                    call.reject("Save failed: " + e.getMessage());
                } finally {
                    try { if (is != null) is.close(); } catch (Exception ignored) {}
                    try { if (os != null) os.close(); } catch (Exception ignored) {}
                }
            }
        }).start();
    }

    /* ==================== MULTI-PLATFORM STORY RESOLVER (SNAPCHAT / INSTAGRAM / FACEBOOK) ==================== */

    private String fetchHtmlString(String targetUrl, String userAgent) {
        try {
            String cur = targetUrl;
            for (int hop = 0; hop < 5; hop++) {
                URL u = new URL(cur);
                HttpURLConnection conn = (HttpURLConnection) u.openConnection();
                conn.setInstanceFollowRedirects(false);
                conn.setRequestProperty("User-Agent", userAgent);
                conn.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8");
                conn.setRequestProperty("Accept-Language", "en-US,en;q=0.9");
                conn.setConnectTimeout(9000);
                conn.setReadTimeout(14000);

                int code = conn.getResponseCode();
                if (code >= 300 && code < 400) {
                    String loc = conn.getHeaderField("Location");
                    conn.disconnect();
                    if (loc != null && !loc.isEmpty()) {
                        if (loc.startsWith("/")) loc = u.getProtocol() + "://" + u.getHost() + loc;
                        cur = loc;
                        continue;
                    }
                }
                if (code >= 200 && code < 400) {
                    StringBuilder sb = new StringBuilder();
                    try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"))) {
                        String line;
                        while ((line = br.readLine()) != null) {
                            sb.append(line);
                            if (sb.length() > 1800000) break;
                        }
                    }
                    conn.disconnect();
                    return sb.toString();
                }
                conn.disconnect();
                break;
            }
        } catch (Exception ignored) {}
        return "";
    }

    private void appendSnapchatSnapList(org.json.JSONArray snapList, String username, String prefix, String avatar, Set<String> seen, JSArray outStories) {
        if (snapList == null) return;
        for (int i = 0; i < snapList.length(); i++) {
            try {
                org.json.JSONObject snap = snapList.getJSONObject(i);
                org.json.JSONObject snapUrls = snap.optJSONObject("snapUrls");
                String mediaUrl = snapUrls != null ? snapUrls.optString("mediaUrl", "") : snap.optString("mediaUrl", "");
                if (mediaUrl.isEmpty() || seen.contains(mediaUrl)) continue;
                seen.add(mediaUrl);

                int mediaType = snap.optInt("snapMediaType", -1);
                boolean isVideo = mediaType == 1 || mediaUrl.toLowerCase().contains(".mp4") || mediaUrl.toLowerCase().contains("mp4");
                String thumb = "";
                if (snapUrls != null && snapUrls.has("mediaPreviewUrl")) {
                    org.json.JSONObject pv = snapUrls.optJSONObject("mediaPreviewUrl");
                    if (pv != null) thumb = pv.optString("value", "");
                }
                if (thumb.isEmpty()) thumb = isVideo ? avatar : mediaUrl;

                String ext = isVideo ? "mp4" : "jpg";
                JSObject item = new JSObject();
                item.put("id", "snap_" + prefix + "_" + i);
                item.put("type", isVideo ? "video" : "image");
                item.put("url", mediaUrl);
                item.put("thumbnail", thumb);
                item.put("ext", ext);
                item.put("filename", sanitizeFilename("Snapchat_" + username + "_" + prefix + "_" + (i + 1) + "." + ext, mediaUrl));
                outStories.put(item);
            } catch (Exception ignored) {}
        }
    }

    @PluginMethod
    public void resolveStories(PluginCall call) {
        final String rawInput = call.getString("input", "").trim();
        final String rawPlat = call.getString("platform", "auto").toLowerCase().trim();

        if (rawInput.isEmpty()) {
            call.reject("Input cannot be empty");
            return;
        }

        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String plat = rawPlat;
                    if (plat.isEmpty() || "auto".equals(plat)) {
                        if (rawInput.toLowerCase().contains("snapchat.com")) plat = "snapchat";
                        else if (rawInput.toLowerCase().contains("instagram.com")) plat = "instagram";
                        else if (rawInput.toLowerCase().contains("facebook.com") || rawInput.toLowerCase().contains("fb.watch")) plat = "facebook";
                    }

                    JSArray stories = new JSArray();
                    Set<String> seen = new HashSet<>();
                    String detectedUser = rawInput.replaceFirst("^@", "");

                    // 1. SNAPCHAT PUBLIC STORIES (__NEXT_DATA__ JSON Parser — Zero Login Required!)
                    if ("snapchat".equals(plat)) {
                        List<String> urlsToTry = new ArrayList<>();
                        if (rawInput.startsWith("http://") || rawInput.startsWith("https://")) {
                            urlsToTry.add(rawInput);
                            Matcher um = Pattern.compile("snapchat\\.com/(?:add|s|story)/([a-zA-Z0-9._-]+)", Pattern.CASE_INSENSITIVE).matcher(rawInput);
                            if (um.find()) detectedUser = um.group(1);
                        } else {
                            detectedUser = rawInput.replaceFirst("^@", "").split("[/?#]")[0].trim();
                            urlsToTry.add("https://www.snapchat.com/add/" + URLEncoder.encode(detectedUser, "UTF-8"));
                            urlsToTry.add("https://story.snapchat.com/s/" + URLEncoder.encode(detectedUser, "UTF-8"));
                        }

                        for (String u : urlsToTry) {
                            String html = fetchHtmlString(u, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36");
                            if (html.isEmpty()) continue;

                            Pattern pNext = Pattern.compile("<script[^>]+id=[\"']__NEXT_DATA__[\"'][^>]*>([\\s\\S]*?)</script>", Pattern.CASE_INSENSITIVE);
                            Matcher mNext = pNext.matcher(html);
                            if (mNext.find()) {
                                try {
                                    org.json.JSONObject root = new org.json.JSONObject(mNext.group(1));
                                    org.json.JSONObject pp = root.optJSONObject("props") != null ? root.optJSONObject("props").optJSONObject("pageProps") : null;
                                    if (pp != null) {
                                        String avatar = "";
                                        org.json.JSONObject up = pp.optJSONObject("userProfile");
                                        if (up != null) {
                                            org.json.JSONObject pub = up.optJSONObject("publicProfileInfo");
                                            if (pub == null) pub = up.optJSONObject("userInfo");
                                            if (pub != null) {
                                                detectedUser = pub.optString("username", detectedUser);
                                                avatar = pub.optString("profilePictureUrl", pub.optString("squareHeroImageUrl", ""));
                                            }
                                        }
                                        org.json.JSONObject st = pp.optJSONObject("story");
                                        if (st != null) {
                                            appendSnapchatSnapList(st.optJSONArray("snapList"), detectedUser, "story", avatar, seen, stories);
                                        }
                                        org.json.JSONArray curHl = pp.optJSONArray("curatedHighlights");
                                        if (curHl != null) {
                                            for (int h = 0; h < curHl.length(); h++) {
                                                org.json.JSONObject hlObj = curHl.optJSONObject(h);
                                                if (hlObj != null) {
                                                    appendSnapchatSnapList(hlObj.optJSONArray("snapList"), detectedUser, "hl" + (h + 1), avatar, seen, stories);
                                                }
                                            }
                                        }
                                        org.json.JSONArray spotHl = pp.optJSONArray("spotlightHighlights");
                                        if (spotHl != null) {
                                            for (int h = 0; h < spotHl.length(); h++) {
                                                org.json.JSONObject hlObj = spotHl.optJSONObject(h);
                                                if (hlObj != null) {
                                                    appendSnapchatSnapList(hlObj.optJSONArray("snapList"), detectedUser, "spot" + (h + 1), avatar, seen, stories);
                                                }
                                            }
                                        }
                                    }
                                } catch (Exception ex) {
                                    Log.w(TAG, "Snapchat __NEXT_DATA__ parse warning: " + ex.getMessage());
                                }
                            }

                            if (stories.length() == 0) {
                                Matcher mv = Pattern.compile("<meta[^>]+property=[\"']og:video(?::secure_url|:url)?[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE).matcher(html);
                                if (mv.find()) {
                                    String vUrl = mv.group(1).replace("&amp;", "&");
                                    JSObject item = new JSObject();
                                    item.put("id", "snap_og_1");
                                    item.put("type", "video");
                                    item.put("url", vUrl);
                                    item.put("thumbnail", "");
                                    item.put("ext", "mp4");
                                    item.put("filename", sanitizeFilename("Snapchat_" + detectedUser + "_1.mp4", vUrl));
                                    stories.put(item);
                                }
                            }
                            if (stories.length() > 0) break;
                        }
                    }

                    // 2. INSTAGRAM & FACEBOOK STORIES (Native Mobile HTML + Embedded JSON Extractor)
                    if ("instagram".equals(plat) || "facebook".equals(plat)) {
                        String targetUrl = rawInput;
                        if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
                            detectedUser = rawInput.replaceFirst("^@", "").split("[/?#]")[0].trim();
                            targetUrl = "instagram".equals(plat)
                                ? "https://www.instagram.com/stories/" + URLEncoder.encode(detectedUser, "UTF-8") + "/"
                                : "https://www.facebook.com/stories/" + URLEncoder.encode(detectedUser, "UTF-8") + "/";
                        }

                        String html = fetchHtmlString(targetUrl, "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1");
                        if (!html.isEmpty()) {
                            Pattern pJsonVid = Pattern.compile("\"(?:browser_native_hd_url|playable_url_quality_hd|browser_native_sd_url|playable_url|video_url)\":\"(https:[^\"\\\\]+)\"");
                            Matcher mJsonVid = pJsonVid.matcher(html);
                            while (mJsonVid.find()) {
                                String vUrl = mJsonVid.group(1).replace("\\/", "/").replace("\\u0026", "&").replace("\\u0025", "%");
                                if (!seen.contains(vUrl)) {
                                    seen.add(vUrl);
                                    JSObject item = new JSObject();
                                    item.put("id", plat + "_vid_" + stories.length());
                                    item.put("type", "video");
                                    item.put("url", vUrl);
                                    item.put("thumbnail", "");
                                    item.put("ext", "mp4");
                                    String label = "instagram".equals(plat) ? "Instagram" : "Facebook";
                                    item.put("filename", sanitizeFilename(label + "_Story_" + (stories.length() + 1) + ".mp4", vUrl));
                                    stories.put(item);
                                }
                            }

                            if (stories.length() == 0) {
                                Matcher mv = Pattern.compile("<meta[^>]+property=[\"']og:video(?::secure_url|:url)?[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE).matcher(html);
                                Matcher mi = Pattern.compile("<meta[^>]+property=[\"']og:image[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE).matcher(html);
                                String thumb = mi.find() ? mi.group(1).replace("&amp;", "&") : "";
                                if (mv.find()) {
                                    String vUrl = mv.group(1).replace("&amp;", "&");
                                    JSObject item = new JSObject();
                                    item.put("id", plat + "_og_vid");
                                    item.put("type", "video");
                                    item.put("url", vUrl);
                                    item.put("thumbnail", thumb);
                                    item.put("ext", "mp4");
                                    String label = "instagram".equals(plat) ? "Instagram" : "Facebook";
                                    item.put("filename", sanitizeFilename(label + "_Story_1.mp4", vUrl));
                                    stories.put(item);
                                }
                            }
                        }
                    }

                    JSObject ret = new JSObject();
                    ret.put("ok", stories.length() > 0);
                    ret.put("platform", plat);
                    ret.put("username", detectedUser);
                    ret.put("stories", stories);
                    if (stories.length() == 0) {
                        ret.put("needsAuth", "instagram".equals(plat) || "facebook".equals(plat));
                    }
                    call.resolve(ret);
                } catch (Exception e) {
                    Log.e(TAG, "resolveStories error", e);
                    JSObject ret = new JSObject();
                    ret.put("ok", false);
                    ret.put("stories", new JSArray());
                    ret.put("error", e.getMessage());
                    call.resolve(ret);
                }
            }
        }).start();
    }
}
