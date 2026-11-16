package com.mahbuobeh.tayyar;

import android.app.DownloadManager;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.BufferedReader;
import java.io.File;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name = "TayyarMobileEngine")
public class TayyarMobilePlugin extends Plugin {
    private static final String TAG = "TayyarMobileEngine";

    @PluginMethod
    public void startDownload(PluginCall call) {
        try {
            String url = call.getString("url");
            if (url == null || url.trim().isEmpty()) {
                call.reject("URL cannot be empty");
                return;
            }
            url = url.trim();

            String filename = call.getString("filename");
            if (filename == null || filename.trim().isEmpty()) {
                filename = Uri.parse(url).getLastPathSegment();
                if (filename == null || filename.isEmpty()) {
                    filename = "tayyar_download_" + System.currentTimeMillis();
                }
            }

            if (url.startsWith("magnet:") || url.contains(".torrent")) {
                call.reject("BitTorrent magnet links require torrent client support");
                return;
            }

            Context context = getContext();
            DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));

            request.setTitle(filename);
            request.setDescription("Tayyar Media Download");
            try {
                request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            } catch (Exception ignored) {}

            request.setAllowedOverMetered(true);
            request.setAllowedOverRoaming(true);

            try {
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, filename);
            } catch (Exception e) {
                File extDir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                if (extDir != null) {
                    request.setDestinationUri(Uri.fromFile(new File(extDir, filename)));
                }
            }

            String referer = call.getString("referer");
            if (referer != null && !referer.isEmpty()) {
                request.addRequestHeader("Referer", referer);
            }
            request.addRequestHeader("User-Agent", "Mozilla/5.0 (Linux; Android 13; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36");

            String lower = filename.toLowerCase();
            if (lower.endsWith(".mp4")) {
                request.setMimeType("video/mp4");
            } else if (lower.endsWith(".mp3")) {
                request.setMimeType("audio/mpeg");
            } else if (lower.endsWith(".m4a")) {
                request.setMimeType("audio/mp4");
            } else if (lower.endsWith(".apk")) {
                request.setMimeType("application/vnd.android.package-archive");
            } else if (lower.endsWith(".zip")) {
                request.setMimeType("application/zip");
            }

            long downloadId = dm.enqueue(request);

            JSObject ret = new JSObject();
            ret.put("ok", true);
            ret.put("downloadId", downloadId);
            ret.put("filename", filename);
            ret.put("url", url);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "Error starting download", e);
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
                DownloadManager dm = (DownloadManager) getContext().getSystemService(Context.DOWNLOAD_SERVICE);
                dm.remove(downloadId);
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

                    // 1. TikTok No-Watermark Resolution (SSSTik mirror via native HTTP - zero CORS)
                    if (url.contains("tiktok.com")) {
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
                                        org.json.JSONArray vStreams = obj.optJSONArray("videoStreams");
                                        JSArray formats = new JSArray();
                                        if (vStreams != null) {
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
                                if (mVid.find()) {
                                    String videoUrl = mVid.group(1).replace("&amp;", "&");
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

                    JSObject fail = new JSObject();
                    fail.put("ok", false);
                    fail.put("error", "Direct stream not found");
                    call.resolve(fail);
                } catch (Exception e) {
                    Log.e(TAG, "resolveSocialUrl error", e);
                    JSObject fail = new JSObject();
                    fail.put("ok", false);
                    fail.put("error", e.getMessage());
                    call.resolve(fail);
                }
            }
        }).start();
    }
}
