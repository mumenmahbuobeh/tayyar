package com.mahbuobeh.tayyar;

import android.app.Activity;
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
import androidx.core.content.FileProvider;
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
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@CapacitorPlugin(name = "TayyarMobileEngine")
public class TayyarMobilePlugin extends Plugin {
    private static final String TAG = "TayyarMobileEngine";

    private static final String UA_CHROME_DESKTOP = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
    private static final String UA_CHROME_MOBILE = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";
    private static final String UA_YT_ANDROID_VR = "com.google.android.apps.youtube.vr.oculus/1.60.19 (Linux; U; Android 12L; eureka-user Build/SQ3A.220605.009.A1) gzip";

    private static class NativeDownloadTask {
        String id;
        String rawUrl;
        String filename;
        String referer;
        String userAgent;
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

    private static class ResolvedStream {
        String url;
        String referer;
        String userAgent;

        ResolvedStream(String url, String referer, String userAgent) {
            this.url = url;
            this.referer = referer != null ? referer : "";
            this.userAgent = (userAgent != null && !userAgent.isEmpty()) ? userAgent : UA_CHROME_MOBILE;
        }
    }

    private static final ConcurrentHashMap<String, NativeDownloadTask> activeTasks = new ConcurrentHashMap<>();
    private static final AtomicInteger taskSeq = new AtomicInteger(1);

    private String sanitizeFilename(String name, String url) {
        if (name == null || name.trim().isEmpty()) {
            name = "Tayyar_Media_" + System.currentTimeMillis();
        }
        String cleaned = name.replaceAll("[\\\\/:*?\"<>|\\r\\n#%&{}$!'@+`=]", "_").trim();
        cleaned = cleaned.replaceAll("_+", "_");
        if (cleaned.startsWith(".") || cleaned.isEmpty()) {
            cleaned = "Tayyar_" + System.currentTimeMillis();
        }
        if (cleaned.length() > 80) {
            int dotIdx = cleaned.lastIndexOf('.');
            if (dotIdx > 0 && cleaned.length() - dotIdx <= 6) {
                String ext = cleaned.substring(dotIdx);
                cleaned = cleaned.substring(0, 72) + ext;
            } else {
                cleaned = cleaned.substring(0, 76);
            }
        }
        if (!cleaned.contains(".")) {
            String uLow = (url != null) ? url.toLowerCase() : "";
            if (uLow.contains(".pdf")) {
                cleaned += ".pdf";
            } else if (uLow.contains(".zip")) {
                cleaned += ".zip";
            } else if (uLow.contains(".apk")) {
                cleaned += ".apk";
            } else if (uLow.contains(".mp3") || uLow.contains("audio")) {
                cleaned += ".mp3";
            } else if (uLow.contains(".jpg") || uLow.contains(".jpeg")) {
                cleaned += ".jpg";
            } else if (uLow.contains(".png")) {
                cleaned += ".png";
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
        if (lower.endsWith(".mov")) return "video/quicktime";
        if (lower.endsWith(".mp3")) return "audio/mpeg";
        if (lower.endsWith(".m4a")) return "audio/mp4";
        if (lower.endsWith(".wav")) return "audio/wav";
        if (lower.endsWith(".apk")) return "application/vnd.android.package-archive";
        if (lower.endsWith(".zip")) return "application/zip";
        if (lower.endsWith(".pdf")) return "application/pdf";
        if (lower.endsWith(".doc")) return "application/msword";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (lower.endsWith(".xls")) return "application/vnd.ms-excel";
        if (lower.endsWith(".xlsx")) return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
        if (lower.endsWith(".txt")) return "text/plain";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png")) return "image/png";
        if (lower.endsWith(".webp")) return "image/webp";
        return "application/octet-stream";
    }

    /* ==================== HTTP HELPERS (FULL 301/302/303/307/308 REDIRECT SUPPORT) ==================== */

    private String resolveRedirects(String initialUrl) {
        try {
            String current = initialUrl;
            for (int i = 0; i < 6; i++) {
                URL u = new URL(current);
                HttpURLConnection conn = (HttpURLConnection) u.openConnection();
                conn.setInstanceFollowRedirects(false);
                conn.setRequestProperty("User-Agent", UA_CHROME_DESKTOP);
                conn.setRequestProperty("Accept-Encoding", "identity");
                conn.setConnectTimeout(7000);
                conn.setReadTimeout(7000);
                int code = conn.getResponseCode();
                String loc = conn.getHeaderField("Location");
                conn.disconnect();
                if (code >= 300 && code < 400 && loc != null && !loc.isEmpty()) {
                    if (loc.startsWith("/")) {
                        loc = u.getProtocol() + "://" + u.getHost() + loc;
                    }
                    current = loc;
                    continue;
                }
                break;
            }
            return current;
        } catch (Exception e) {
            return initialUrl;
        }
    }

    private String httpGetText(String targetUrl, String userAgent, String referer) {
        try {
            String cur = targetUrl;
            for (int hop = 0; hop < 6; hop++) {
                URL u = new URL(cur);
                HttpURLConnection conn = (HttpURLConnection) u.openConnection();
                conn.setInstanceFollowRedirects(false);
                conn.setRequestProperty("User-Agent", userAgent != null ? userAgent : UA_CHROME_DESKTOP);
                conn.setRequestProperty("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8");
                conn.setRequestProperty("Accept-Language", "en-US,en;q=0.9");
                conn.setRequestProperty("Accept-Encoding", "identity");
                if (referer != null && !referer.isEmpty()) {
                    conn.setRequestProperty("Referer", referer);
                }
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
                    InputStream stream = conn.getInputStream();
                    String encoding = conn.getContentEncoding();
                    if (encoding != null && encoding.toLowerCase().contains("gzip")) {
                        stream = new java.util.zip.GZIPInputStream(stream);
                    }
                    StringBuilder sb = new StringBuilder();
                    try (BufferedReader br = new BufferedReader(new InputStreamReader(stream, "UTF-8"))) {
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

    private String httpPostText(String targetUrl, String body, String contentType, String userAgent, String origin, String referer) {
        HttpURLConnection conn = null;
        try {
            URL u = new URL(targetUrl);
            conn = (HttpURLConnection) u.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setInstanceFollowRedirects(true);
            conn.setRequestProperty("Content-Type", contentType);
            conn.setRequestProperty("User-Agent", userAgent != null ? userAgent : UA_CHROME_DESKTOP);
            conn.setRequestProperty("Accept", "application/json, text/plain, */*");
            conn.setRequestProperty("Accept-Encoding", "identity");
            if (origin != null && !origin.isEmpty()) conn.setRequestProperty("Origin", origin);
            if (referer != null && !referer.isEmpty()) conn.setRequestProperty("Referer", referer);
            conn.setConnectTimeout(10000);
            conn.setReadTimeout(15000);

            byte[] bodyBytes = body.getBytes("UTF-8");
            conn.setFixedLengthStreamingMode(bodyBytes.length);
            try (OutputStream os = conn.getOutputStream()) {
                os.write(bodyBytes);
            }

            int code = conn.getResponseCode();
            InputStream stream = (code >= 200 && code < 400) ? conn.getInputStream() : conn.getErrorStream();
            if (stream == null) return "";
            String encoding = conn.getContentEncoding();
            if (encoding != null && encoding.toLowerCase().contains("gzip")) {
                stream = new java.util.zip.GZIPInputStream(stream);
            }
            StringBuilder sb = new StringBuilder();
            try (BufferedReader br = new BufferedReader(new InputStreamReader(stream, "UTF-8"))) {
                String line;
                while ((line = br.readLine()) != null) {
                    sb.append(line);
                    if (sb.length() > 1500000) break;
                }
            }
            return sb.toString();
        } catch (Exception ignored) {
            return "";
        } finally {
            if (conn != null) conn.disconnect();
        }
    }

    /* ==================== LIVE-VERIFIED MULTI-PLATFORM RESOLVERS ==================== */

    private String extractYouTubeVideoId(String input) {
        if (input == null || input.trim().isEmpty()) return null;
        String s = input.trim();
        Matcher m = Pattern.compile("(?:v=|v%3D|shorts/|live/|youtu\\.be/|embed/)([a-zA-Z0-9_-]{11})", Pattern.CASE_INSENSITIVE).matcher(s);
        if (m.find()) return m.group(1);
        if (s.matches("^[a-zA-Z0-9_-]{11}$")) return s;
        return null;
    }

    private JSObject resolveYouTube(String videoId) {
        if (videoId == null || videoId.isEmpty()) return null;

        // --- ATTEMPT 1: InnerTube ANDROID_VR (Gives progressive single-file MP4 with full audio muxed) ---
        try {
            String payloadVr = "{\"videoId\":\"" + videoId + "\",\"context\":{\"client\":{\"clientName\":\"ANDROID_VR\",\"clientVersion\":\"1.60.19\",\"deviceMake\":\"Oculus\",\"deviceModel\":\"Quest 3\",\"osName\":\"Android\",\"osVersion\":\"12L\",\"androidSdkVersion\":32,\"hl\":\"en\",\"gl\":\"US\"}},\"contentCheckOk\":true,\"racyCheckOk\":true}";
            String respVr = httpPostText(
                "https://www.youtube.com/youtubei/v1/player?prettyPrint=false",
                payloadVr,
                "application/json",
                UA_YT_ANDROID_VR,
                "https://www.youtube.com",
                "https://www.youtube.com/"
            );
            if (!respVr.isEmpty()) {
                org.json.JSONObject rootVr = new org.json.JSONObject(respVr);
                org.json.JSONObject playVr = rootVr.optJSONObject("playabilityStatus");
                if (playVr != null && "OK".equalsIgnoreCase(playVr.optString("status", ""))) {
                    org.json.JSONObject details = rootVr.optJSONObject("videoDetails");
                    String title = details != null ? details.optString("title", "YouTube Video") : "YouTube Video";
                    String author = details != null ? details.optString("author", "YouTube") : "YouTube";
                    String thumb = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";
                    org.json.JSONObject streaming = rootVr.optJSONObject("streamingData");
                    if (streaming != null) {
                        JSArray formats = new JSArray();
                        org.json.JSONArray prog = streaming.optJSONArray("formats");
                        if (prog != null) {
                            for (int i = prog.length() - 1; i >= 0; i--) {
                                org.json.JSONObject f = prog.optJSONObject(i);
                                if (f == null) continue;
                                String fUrl = f.optString("url", "");
                                if (fUrl.isEmpty()) continue;
                                String qLabel = f.optString("qualityLabel", "HD");
                                JSObject fmt = new JSObject();
                                fmt.put("id", "video_" + qLabel);
                                fmt.put("quality", "Video MP4 (" + qLabel + ")");
                                fmt.put("ext", "mp4");
                                fmt.put("url", fUrl);
                                fmt.put("directUrl", fUrl);
                                fmt.put("userAgent", UA_YT_ANDROID_VR);
                                formats.put(fmt);
                            }
                        }
                        org.json.JSONArray adaptive = streaming.optJSONArray("adaptiveFormats");
                        if (formats.length() == 0 && adaptive != null) {
                            for (int i = 0; i < adaptive.length(); i++) {
                                org.json.JSONObject af = adaptive.optJSONObject(i);
                                if (af == null) continue;
                                String mime = af.optString("mimeType", "").toLowerCase();
                                String vUrl = af.optString("url", "");
                                if (mime.startsWith("video/mp4") && !vUrl.isEmpty()) {
                                    JSObject fmt = new JSObject();
                                    fmt.put("id", "video_hd");
                                    fmt.put("quality", "Video MP4 (" + af.optString("qualityLabel", "HD") + ")");
                                    fmt.put("ext", "mp4");
                                    fmt.put("url", vUrl);
                                    fmt.put("directUrl", vUrl);
                                    fmt.put("userAgent", UA_YT_ANDROID_VR);
                                    formats.put(fmt);
                                    break;
                                }
                            }
                        }
                        if (adaptive != null) {
                            String bestAudioUrl = "";
                            int bestBitrate = 0;
                            for (int i = 0; i < adaptive.length(); i++) {
                                org.json.JSONObject af = adaptive.optJSONObject(i);
                                if (af == null) continue;
                                String mime = af.optString("mimeType", "").toLowerCase();
                                String aUrl = af.optString("url", "");
                                int br = af.optInt("bitrate", 0);
                                if (mime.startsWith("audio/mp4") && !aUrl.isEmpty() && br >= bestBitrate) {
                                    bestBitrate = br;
                                    bestAudioUrl = aUrl;
                                }
                            }
                            if (!bestAudioUrl.isEmpty()) {
                                JSObject fAudio = new JSObject();
                                fAudio.put("id", "audio");
                                fAudio.put("quality", "Audio Only (M4A)");
                                fAudio.put("ext", "m4a");
                                fAudio.put("url", bestAudioUrl);
                                fAudio.put("directUrl", bestAudioUrl);
                                fAudio.put("userAgent", UA_YT_ANDROID_VR);
                                formats.put(fAudio);
                            }
                        }
                        if (formats.length() > 0) {
                            JSObject ret = new JSObject();
                            ret.put("ok", true);
                            ret.put("platform", "YouTube");
                            ret.put("title", title);
                            ret.put("author", author);
                            ret.put("thumbnail", thumb);
                            ret.put("formats", formats);
                            return ret;
                        }
                    }
                }
            }
        } catch (Exception ex) {
            Log.w(TAG, "YouTube ANDROID_VR attempt warning: " + ex.getMessage());
        }

        // --- ATTEMPT 2: InnerTube VISIONOS + SOCS=CAI Consent + visitorData (Direct unciphered MP4 HD & Audio) ---
        try {
            // 1. Fetch watch page with SOCS=CAI cookie to collect visitorData and cookies
            String watchUrl = "https://www.youtube.com/watch?v=" + videoId + "&bpctr=9999999999&has_verified=1";
            HttpURLConnection watchConn = (HttpURLConnection) new URL(watchUrl).openConnection();
            watchConn.setRequestProperty("User-Agent", UA_CHROME_DESKTOP);
            watchConn.setRequestProperty("Cookie", "PREF=hl=en&tz=UTC; SOCS=CAI");
            watchConn.setRequestProperty("Accept-Language", "en-US,en;q=0.9");
            watchConn.setConnectTimeout(8000);
            watchConn.setReadTimeout(12000);

            StringBuilder watchHtml = new StringBuilder();
            String visitorData = "";
            StringBuilder cookiesBuilder = new StringBuilder("PREF=hl=en&tz=UTC; SOCS=CAI");

            List<String> cookies = watchConn.getHeaderFields().get("Set-Cookie");
            if (cookies != null) {
                for (String c : cookies) {
                    String part = c.split(";")[0].trim();
                    if (!part.isEmpty()) {
                        cookiesBuilder.append("; ").append(part);
                    }
                }
            }

            InputStream wStream = (watchConn.getResponseCode() >= 200 && watchConn.getResponseCode() < 400)
                ? watchConn.getInputStream() : watchConn.getErrorStream();
            if (wStream != null) {
                String enc = watchConn.getContentEncoding();
                if (enc != null && enc.toLowerCase().contains("gzip")) {
                    wStream = new java.util.zip.GZIPInputStream(wStream);
                }
                try (BufferedReader br = new BufferedReader(new InputStreamReader(wStream, "UTF-8"))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        watchHtml.append(line);
                        if (watchHtml.length() > 2000000) break;
                    }
                }
            }
            watchConn.disconnect();

            String htmlStr = watchHtml.toString();
            Matcher mvData = Pattern.compile("\"visitorData\"\\s*:\\s*\"([^\"]+)\"").matcher(htmlStr);
            if (mvData.find()) {
                visitorData = mvData.group(1);
            }

            String pageTitle = "YouTube Video";
            Matcher mt = Pattern.compile("<title>([^<]+)</title>", Pattern.CASE_INSENSITIVE).matcher(htmlStr);
            if (mt.find()) {
                pageTitle = mt.group(1).replace(" - YouTube", "").trim();
            }

            // 2. POST player API with VISIONOS context & visitorData
            org.json.JSONObject clientObj = new org.json.JSONObject();
            clientObj.put("clientName", "VISIONOS");
            clientObj.put("clientVersion", "1.02");
            clientObj.put("deviceMake", "Apple");
            clientObj.put("deviceModel", "RealityDevice17,1");
            clientObj.put("userAgent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15");
            clientObj.put("osName", "visionOS");
            clientObj.put("osVersion", "26.5.23O471");
            clientObj.put("hl", "en");
            clientObj.put("gl", "US");
            if (!visitorData.isEmpty()) {
                clientObj.put("visitorData", visitorData);
            }

            org.json.JSONObject contextObj = new org.json.JSONObject();
            contextObj.put("client", clientObj);

            org.json.JSONObject postBody = new org.json.JSONObject();
            postBody.put("context", contextObj);
            postBody.put("videoId", videoId);
            postBody.put("contentCheckOk", true);
            postBody.put("racyCheckOk", true);

            HttpURLConnection pConn = (HttpURLConnection) new URL("https://www.youtube.com/youtubei/v1/player?prettyPrint=false").openConnection();
            pConn.setRequestMethod("POST");
            pConn.setDoOutput(true);
            pConn.setRequestProperty("Content-Type", "application/json");
            pConn.setRequestProperty("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15");
            pConn.setRequestProperty("X-Youtube-Client-Name", "101");
            pConn.setRequestProperty("X-Youtube-Client-Version", "1.02");
            if (!visitorData.isEmpty()) {
                pConn.setRequestProperty("X-Goog-Visitor-Id", visitorData);
            }
            pConn.setRequestProperty("Origin", "https://www.youtube.com");
            pConn.setRequestProperty("Cookie", cookiesBuilder.toString());
            pConn.setConnectTimeout(9000);
            pConn.setReadTimeout(15000);

            byte[] bBytes = postBody.toString().getBytes("UTF-8");
            pConn.setFixedLengthStreamingMode(bBytes.length);
            try (OutputStream os = pConn.getOutputStream()) {
                os.write(bBytes);
            }

            int pCode = pConn.getResponseCode();
            InputStream pStream = (pCode >= 200 && pCode < 400) ? pConn.getInputStream() : pConn.getErrorStream();
            if (pStream != null) {
                String enc = pConn.getContentEncoding();
                if (enc != null && enc.toLowerCase().contains("gzip")) {
                    pStream = new java.util.zip.GZIPInputStream(pStream);
                }
                StringBuilder pSb = new StringBuilder();
                try (BufferedReader br = new BufferedReader(new InputStreamReader(pStream, "UTF-8"))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        pSb.append(line);
                        if (pSb.length() > 2000000) break;
                    }
                }
                pConn.disconnect();

                org.json.JSONObject pRoot = new org.json.JSONObject(pSb.toString());
                org.json.JSONObject pPlay = pRoot.optJSONObject("playabilityStatus");
                if (pPlay != null && "OK".equalsIgnoreCase(pPlay.optString("status", ""))) {
                    org.json.JSONObject pDetails = pRoot.optJSONObject("videoDetails");
                    String title = pDetails != null ? pDetails.optString("title", pageTitle) : pageTitle;
                    String author = pDetails != null ? pDetails.optString("author", "YouTube") : "YouTube";
                    String thumb = "https://i.ytimg.com/vi/" + videoId + "/hqdefault.jpg";

                    org.json.JSONObject pStreaming = pRoot.optJSONObject("streamingData");
                    if (pStreaming != null) {
                        JSArray formats = new JSArray();
                        org.json.JSONArray adaptive = pStreaming.optJSONArray("adaptiveFormats");
                        if (adaptive != null) {
                            for (int i = 0; i < adaptive.length(); i++) {
                                org.json.JSONObject af = adaptive.optJSONObject(i);
                                if (af == null) continue;
                                String mime = af.optString("mimeType", "").toLowerCase();
                                String vUrl = af.optString("url", "");
                                if (mime.startsWith("video/mp4") && !vUrl.isEmpty()) {
                                    String qLabel = af.optString("qualityLabel", "HD");
                                    JSObject fmt = new JSObject();
                                    fmt.put("id", "video_" + qLabel);
                                    fmt.put("quality", "Video MP4 (" + qLabel + ")");
                                    fmt.put("ext", "mp4");
                                    fmt.put("url", vUrl);
                                    fmt.put("directUrl", vUrl);
                                    fmt.put("userAgent", UA_CHROME_DESKTOP);
                                    formats.put(fmt);
                                }
                            }
                            String bestAudioUrl = "";
                            int bestBitrate = 0;
                            for (int i = 0; i < adaptive.length(); i++) {
                                org.json.JSONObject af = adaptive.optJSONObject(i);
                                if (af == null) continue;
                                String mime = af.optString("mimeType", "").toLowerCase();
                                String aUrl = af.optString("url", "");
                                int br = af.optInt("bitrate", 0);
                                if (mime.startsWith("audio/mp4") && !aUrl.isEmpty() && br >= bestBitrate) {
                                    bestBitrate = br;
                                    bestAudioUrl = aUrl;
                                }
                            }
                            if (!bestAudioUrl.isEmpty()) {
                                JSObject fAudio = new JSObject();
                                fAudio.put("id", "audio");
                                fAudio.put("quality", "Audio Only (M4A)");
                                fAudio.put("ext", "m4a");
                                fAudio.put("url", bestAudioUrl);
                                fAudio.put("directUrl", bestAudioUrl);
                                fAudio.put("userAgent", UA_CHROME_DESKTOP);
                                formats.put(fAudio);
                            }
                        }
                        if (formats.length() > 0) {
                            JSObject ret = new JSObject();
                            ret.put("ok", true);
                            ret.put("platform", "YouTube");
                            ret.put("title", title);
                            ret.put("author", author);
                            ret.put("thumbnail", thumb);
                            ret.put("formats", formats);
                            return ret;
                        }
                    }
                }
            }
        } catch (Exception ex) {
            Log.w(TAG, "YouTube VISIONOS attempt warning: " + ex.getMessage());
        }

        return null;
    }

    private JSObject resolveTikTok(String url) {
        // 1. PRIMARY: SSSTik (global Cloudflare tikcdn.io CDN — bypasses regional tiktokcdn-us.com blocks!)
        try {
            String home = httpGetText("https://ssstik.io/", UA_CHROME_DESKTOP, "");
            String tt = "";
            Matcher mTt = Pattern.compile("tt\\s*=\\s*'([^']+)'").matcher(home);
            if (mTt.find()) tt = mTt.group(1);
            String postData = "id=" + URLEncoder.encode(url, "UTF-8") + "&locale=en&tt=" + URLEncoder.encode(tt, "UTF-8");
            String html = httpPostText("https://ssstik.io/abc?url=dl", postData, "application/x-www-form-urlencoded", UA_CHROME_DESKTOP, "https://ssstik.io", "https://ssstik.io/en");
            JSArray formats = new JSArray();
            Matcher m = Pattern.compile("href=\"(https://tikcdn\\.io/ssstik/[^\"]+)\"").matcher(html);
            if (m.find()) {
                JSObject f1 = new JSObject();
                f1.put("id", "nowm");
                f1.put("quality", "HD No Watermark (MP4)");
                f1.put("ext", "mp4");
                f1.put("url", m.group(1));
                f1.put("directUrl", m.group(1));
                f1.put("referer", "https://ssstik.io/");
                f1.put("userAgent", UA_CHROME_DESKTOP);
                formats.put(f1);
            }
            Matcher mAud = Pattern.compile("href=\"(https://tikcdn\\.io/ssstik/mp3/[^\"]+)\"").matcher(html);
            if (mAud.find()) {
                JSObject fAud = new JSObject();
                fAud.put("id", "audio");
                fAud.put("quality", "Audio Only (MP3)");
                fAud.put("ext", "mp3");
                fAud.put("url", mAud.group(1));
                fAud.put("directUrl", mAud.group(1));
                fAud.put("referer", "https://ssstik.io/");
                fAud.put("userAgent", UA_CHROME_DESKTOP);
                formats.put(fAud);
            }
            if (formats.length() > 0) {
                String title = "TikTok Video";
                Matcher mTitle = Pattern.compile("<p class=\"maintext\">([\\s\\S]*?)</p>").matcher(html);
                if (mTitle.find()) title = mTitle.group(1).replaceAll("<[^>]+>", "").trim();
                String thumb = "";
                Matcher mThumb = Pattern.compile("src=\"(https://tikcdn\\.io/ssstik/thumb/[^\"]+)\"").matcher(html);
                if (mThumb.find()) thumb = mThumb.group(1);

                JSObject ret = new JSObject();
                ret.put("ok", true);
                ret.put("platform", "TikTok");
                ret.put("title", title.isEmpty() ? "TikTok Video" : title);
                ret.put("author", "TikTok");
                ret.put("thumbnail", thumb);
                ret.put("formats", formats);
                return ret;
            }
        } catch (Exception ex) {
            Log.w(TAG, "SSSTik warning: " + ex.getMessage());
        }

        // 2. NNTech Free TikTok API backup
        try {
            String resp = httpGetText("https://nntech-free-tt-api.vercel.app/api/tiktok/mp4?url=" + URLEncoder.encode(url, "UTF-8"), UA_CHROME_DESKTOP, "");
            if (!resp.isEmpty()) {
                org.json.JSONObject obj = new org.json.JSONObject(resp);
                String dl = obj.optString("download", "");
                if (!dl.isEmpty() && dl.startsWith("http")) {
                    JSArray formats = new JSArray();
                    JSObject f1 = new JSObject();
                    f1.put("id", "nowm");
                    f1.put("quality", "HD No Watermark (MP4)");
                    f1.put("ext", "mp4");
                    f1.put("url", dl);
                    f1.put("directUrl", dl);
                    f1.put("referer", "https://www.tiktok.com/");
                    formats.put(f1);

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("platform", "TikTok");
                    ret.put("title", obj.optString("title", "TikTok Video"));
                    ret.put("author", "TikTok");
                    ret.put("thumbnail", "");
                    ret.put("formats", formats);
                    return ret;
                }
            }
        } catch (Exception ignored) {}

        // 3. TikWM API backup (skip US-blocked CDN only if SSSTik & NNTech both failed)
        try {
            String jsonStr = httpGetText("https://www.tikwm.com/api/?url=" + URLEncoder.encode(url, "UTF-8"), UA_CHROME_MOBILE, "https://www.tikwm.com/");
            if (!jsonStr.isEmpty()) {
                org.json.JSONObject obj = new org.json.JSONObject(jsonStr);
                if (obj.optInt("code", -1) == 0 && obj.has("data")) {
                    org.json.JSONObject data = obj.getJSONObject("data");
                    String play = data.optString("play", "");
                    String music = data.optString("music", "");
                    if (!play.isEmpty() && !play.startsWith("http")) play = "https://www.tikwm.com" + play;
                    if (!music.isEmpty() && !music.startsWith("http")) music = "https://www.tikwm.com" + music;

                    JSArray formats = new JSArray();
                    if (!play.isEmpty()) {
                        JSObject f1 = new JSObject();
                        f1.put("id", "nowm");
                        f1.put("quality", "HD No Watermark (MP4)");
                        f1.put("ext", "mp4");
                        f1.put("url", play);
                        f1.put("directUrl", play);
                        f1.put("referer", "https://www.tiktok.com/");
                        f1.put("userAgent", UA_CHROME_MOBILE);
                        formats.put(f1);
                    }
                    if (!music.isEmpty()) {
                        JSObject fAudio = new JSObject();
                        fAudio.put("id", "audio");
                        fAudio.put("quality", "Audio Only (MP3)");
                        fAudio.put("ext", "mp3");
                        fAudio.put("url", music);
                        fAudio.put("directUrl", music);
                        fAudio.put("referer", "https://www.tiktok.com/");
                        fAudio.put("userAgent", UA_CHROME_MOBILE);
                        formats.put(fAudio);
                    }
                    if (formats.length() > 0) {
                        org.json.JSONObject authorObj = data.optJSONObject("author");
                        String author = authorObj != null ? authorObj.optString("nickname", "TikTok Creator") : "TikTok Creator";
                        String cover = data.optString("cover", "");
                        if (!cover.isEmpty() && !cover.startsWith("http")) cover = "https://www.tikwm.com" + cover;
                        JSObject ret = new JSObject();
                        ret.put("ok", true);
                        ret.put("platform", "TikTok");
                        ret.put("title", data.optString("title", "TikTok Video"));
                        ret.put("author", author);
                        ret.put("thumbnail", cover);
                        ret.put("formats", formats);
                        return ret;
                    }
                }
            }
        } catch (Exception ex) {
            Log.w(TAG, "TikWM warning: " + ex.getMessage());
        }

        return null;
    }

    private JSObject resolveFacebook(String url) {
        // 1. LIVE-VERIFIED fdown.co.in/ajax (Direct HD fbcdn.net MP4 links!)
        try {
            org.json.JSONObject reqBody = new org.json.JSONObject();
            reqBody.put("url", url);
            String resp = httpPostText(
                "https://fdown.co.in/ajax",
                reqBody.toString(),
                "application/json",
                UA_CHROME_DESKTOP,
                "https://fdown.co.in",
                "https://fdown.co.in/"
            );
            if (!resp.isEmpty()) {
                org.json.JSONObject obj = new org.json.JSONObject(resp);
                if (obj.optBoolean("success", false) && obj.has("links")) {
                    org.json.JSONObject links = obj.optJSONObject("links");
                    if (links != null) {
                        String bestUrl = "";
                        Iterator<String> keys = links.keys();
                        while (keys.hasNext()) {
                            String k = keys.next();
                            String v = links.optString(k, "");
                            if (v.startsWith("http")) {
                                if (bestUrl.isEmpty() || k.toLowerCase().contains("hd") || k.contains("1080") || k.contains("720")) {
                                    bestUrl = v.replace("\\/", "/").replace("&amp;", "&");
                                }
                            }
                        }
                        if (!bestUrl.isEmpty()) {
                            JSArray formats = new JSArray();
                            JSObject f1 = new JSObject();
                            f1.put("id", "hd");
                            f1.put("quality", "Facebook HD (MP4)");
                            f1.put("ext", "mp4");
                            f1.put("url", bestUrl);
                            f1.put("directUrl", bestUrl);
                            f1.put("userAgent", UA_CHROME_DESKTOP);
                            formats.put(f1);

                            JSObject ret = new JSObject();
                            ret.put("ok", true);
                            ret.put("platform", "Facebook");
                            ret.put("title", obj.optString("title", "Facebook Video"));
                            ret.put("author", obj.optString("uploader", "Facebook"));
                            ret.put("thumbnail", obj.optString("thumbnail", ""));
                            ret.put("formats", formats);
                            return ret;
                        }
                    }
                }
            }
        } catch (Exception ex) {
            Log.w(TAG, "Facebook fdown warning: " + ex.getMessage());
        }

        // 2. Mobile HTML embedded video URL fallback
        try {
            String html = httpGetText(url, UA_CHROME_MOBILE, "https://m.facebook.com/");
            if (!html.isEmpty()) {
                Matcher m = Pattern.compile("\"(?:browser_native_hd_url|playable_url_quality_hd|browser_native_sd_url|playable_url)\":\"(https:[^\"\\\\]+)\"").matcher(html);
                if (m.find()) {
                    String vUrl = m.group(1).replace("\\/", "/").replace("\\u0026", "&").replace("\\u0025", "%");
                    JSArray formats = new JSArray();
                    JSObject f1 = new JSObject();
                    f1.put("id", "hd");
                    f1.put("quality", "Facebook HD (MP4)");
                    f1.put("ext", "mp4");
                    f1.put("url", vUrl);
                    f1.put("directUrl", vUrl);
                    f1.put("userAgent", UA_CHROME_MOBILE);
                    formats.put(f1);

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("platform", "Facebook");
                    ret.put("title", "Facebook Video");
                    ret.put("author", "Facebook");
                    ret.put("thumbnail", "");
                    ret.put("formats", formats);
                    return ret;
                }
            }
        } catch (Exception ignored) {}

        return null;
    }

    private JSObject resolveInstagram(String url) {
        // 1. Instagram public embed endpoint (/p/{code}/embed/captioned/)
        try {
            Matcher sc = Pattern.compile("/(?:p|reel|tv)/([A-Za-z0-9_-]+)").matcher(url);
            if (sc.find()) {
                String code = sc.group(1);
                String html = httpGetText("https://www.instagram.com/p/" + code + "/embed/captioned/", UA_CHROME_DESKTOP, "https://www.instagram.com/");
                if (!html.isEmpty()) {
                    Matcher mv = Pattern.compile("\"video_url\"\\s*:\\s*\"(https:[^\"\\\\]+)\"").matcher(html);
                    Matcher mi = Pattern.compile("\"display_url\"\\s*:\\s*\"(https:[^\"\\\\]+)\"").matcher(html);
                    String vidUrl = mv.find() ? mv.group(1).replace("\\u0026", "&").replace("\\/", "/").replace("\\u002F", "/") : "";
                    String imgUrl = mi.find() ? mi.group(1).replace("\\u0026", "&").replace("\\/", "/").replace("\\u002F", "/") : "";
                    if (!vidUrl.isEmpty() || !imgUrl.isEmpty()) {
                        boolean isVid = !vidUrl.isEmpty();
                        JSArray formats = new JSArray();
                        JSObject f1 = new JSObject();
                        f1.put("id", isVid ? "video" : "image");
                        f1.put("quality", isVid ? "Instagram HD (MP4)" : "Instagram Photo (JPG)");
                        f1.put("ext", isVid ? "mp4" : "jpg");
                        f1.put("url", isVid ? vidUrl : imgUrl);
                        f1.put("directUrl", isVid ? vidUrl : imgUrl);
                        f1.put("userAgent", UA_CHROME_DESKTOP);
                        formats.put(f1);

                        JSObject ret = new JSObject();
                        ret.put("ok", true);
                        ret.put("platform", "Instagram");
                        ret.put("title", "Instagram_" + code);
                        ret.put("author", "Instagram");
                        ret.put("thumbnail", imgUrl);
                        ret.put("formats", formats);
                        return ret;
                    }
                }
            }
        } catch (Exception ignored) {}

        // 2. Direct page embedded JSON video_versions / video_url / og:video
        try {
            String html = httpGetText(url, UA_CHROME_DESKTOP, "https://www.instagram.com/");
            if (!html.isEmpty()) {
                Matcher mv = Pattern.compile("\"(?:video_url|playback_url)\"\\s*:\\s*\"(https:[^\"\\\\]+)\"").matcher(html);
                if (!mv.find()) {
                    mv = Pattern.compile("<meta[^>]+property=[\"']og:video(?::secure_url|:url)?[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE).matcher(html);
                }
                if (mv.find()) {
                    String vidUrl = mv.group(1).replace("\\u0026", "&").replace("\\/", "/").replace("&amp;", "&");
                    JSArray formats = new JSArray();
                    JSObject f1 = new JSObject();
                    f1.put("id", "video");
                    f1.put("quality", "Instagram HD (MP4)");
                    f1.put("ext", "mp4");
                    f1.put("url", vidUrl);
                    f1.put("directUrl", vidUrl);
                    f1.put("userAgent", UA_CHROME_DESKTOP);
                    formats.put(f1);

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("platform", "Instagram");
                    ret.put("title", "Instagram Video");
                    ret.put("author", "Instagram");
                    ret.put("thumbnail", "");
                    ret.put("formats", formats);
                    return ret;
                }
            }
        } catch (Exception ignored) {}

        // 3. SnapInsta API backup
        try {
            String post = "q=" + URLEncoder.encode(url, "UTF-8") + "&scope=home&lang=en";
            String html = httpPostText("https://snapinsta.lc/process", post, "application/x-www-form-urlencoded", UA_CHROME_DESKTOP, "https://snapinsta.lc", "https://snapinsta.lc/");
            Matcher m = Pattern.compile("data-media-type=\"(video|image)\"\\s+data-media-src=\"([^\"]+)\"", Pattern.CASE_INSENSITIVE).matcher(html);
            if (m.find()) {
                boolean isVid = "video".equalsIgnoreCase(m.group(1));
                String mediaUrl = m.group(2).replace("&amp;", "&");
                JSArray formats = new JSArray();
                JSObject f1 = new JSObject();
                f1.put("id", isVid ? "video" : "image");
                f1.put("quality", isVid ? "Instagram HD (MP4)" : "Instagram Photo (JPG)");
                f1.put("ext", isVid ? "mp4" : "jpg");
                f1.put("url", mediaUrl);
                f1.put("directUrl", mediaUrl);
                formats.put(f1);

                JSObject ret = new JSObject();
                ret.put("ok", true);
                ret.put("platform", "Instagram");
                ret.put("title", "Instagram Media");
                ret.put("author", "Instagram");
                ret.put("thumbnail", "");
                ret.put("formats", formats);
                return ret;
            }
        } catch (Exception ignored) {}

        return null;
    }

    private JSObject resolveTwitter(String url) {
        try {
            Matcher m = Pattern.compile("(?:twitter\\.com|x\\.com)/([^/]+)/status/(\\d+)", Pattern.CASE_INSENSITIVE).matcher(url);
            if (!m.find()) return null;
            String resp = httpGetText("https://api.fxtwitter.com/" + m.group(1) + "/status/" + m.group(2), UA_CHROME_DESKTOP, "");
            if (resp.isEmpty()) return null;
            org.json.JSONObject root = new org.json.JSONObject(resp);
            org.json.JSONObject tweet = root.optJSONObject("tweet");
            if (tweet == null) return null;
            org.json.JSONObject media = tweet.optJSONObject("media");
            org.json.JSONArray vids = media != null ? media.optJSONArray("videos") : null;
            if (vids != null && vids.length() > 0) {
                org.json.JSONObject v = vids.getJSONObject(0);
                String vUrl = v.optString("url", "");
                if (!vUrl.isEmpty()) {
                    JSArray formats = new JSArray();
                    JSObject f1 = new JSObject();
                    f1.put("id", "video");
                    f1.put("quality", "Twitter / X HD (MP4)");
                    f1.put("ext", "mp4");
                    f1.put("url", vUrl);
                    f1.put("directUrl", vUrl);
                    formats.put(f1);

                    JSObject ret = new JSObject();
                    ret.put("ok", true);
                    ret.put("platform", "Twitter / X");
                    String txt = tweet.optString("text", "X Video");
                    ret.put("title", txt.length() > 60 ? txt.substring(0, 60) : txt);
                    org.json.JSONObject auth = tweet.optJSONObject("author");
                    ret.put("author", auth != null ? auth.optString("name", m.group(1)) : m.group(1));
                    ret.put("thumbnail", v.optString("thumbnail_url", ""));
                    ret.put("formats", formats);
                    return ret;
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private ResolvedStream resolveDirectStreamIfNeeded(String initialUrl, boolean isAudio, String providedReferer, String providedUa) {
        try {
            String url = initialUrl.trim();
            // Already a direct CDN media link or direct file/document link
            String low = url.toLowerCase();
            if (low.contains("googlevideo.com") || low.contains("videoplayback") ||
                low.contains("tikcdn.io") || low.contains("tiktokcdn") || low.contains("/video/tos/") ||
                low.contains("cdninstagram.com") || low.contains("fbcdn.net") || low.contains("sc-cdn.net") ||
                low.contains("twimg.com") || low.contains("v.redd.it") ||
                low.contains(".tiktok.com/video/tos/") || low.contains("byteoversea.com") ||
                low.matches(".*\\.(mp4|mp3|m4a|mkv|webm|avi|mov|flv|wav|ogg|jpg|jpeg|png|webp|gif|apk|zip|rar|7z|tar|gz|pdf|doc|docx|xls|xlsx|ppt|pptx|txt|exe|dmg|iso)(\\?.*)?$")) {
                String ua = (providedUa != null && !providedUa.isEmpty()) ? providedUa
                    : (low.contains("googlevideo.com") ? UA_YT_ANDROID_VR : UA_CHROME_MOBILE);
                return new ResolvedStream(url, providedReferer, ua);
            }

            url = resolveRedirects(url);
            JSObject resolved = null;
            if (url.contains("youtube.com") || url.contains("youtu.be")) {
                resolved = resolveYouTubeInnerTube(url);
            } else if (url.contains("tiktok.com")) {
                resolved = resolveTikTok(url);
            } else if (url.contains("facebook.com") || url.contains("fb.watch") || url.contains("fb.com")) {
                resolved = resolveFacebook(url);
            } else if (url.contains("instagram.com")) {
                resolved = resolveInstagram(url);
            } else if (url.contains("twitter.com") || url.contains("x.com")) {
                resolved = resolveTwitter(url);
            }

            if (resolved != null && resolved.has("formats")) {
                org.json.JSONArray fmts = resolved.getJSONArray("formats");
                for (int i = 0; i < fmts.length(); i++) {
                    org.json.JSONObject f = fmts.getJSONObject(i);
                    boolean fmtAudio = "audio".equalsIgnoreCase(f.optString("id", "")) || "mp3".equalsIgnoreCase(f.optString("ext", "")) || "m4a".equalsIgnoreCase(f.optString("ext", ""));
                    if (isAudio == fmtAudio && !f.optString("url", "").isEmpty()) {
                        return new ResolvedStream(f.optString("url"), f.optString("referer", providedReferer), f.optString("userAgent", providedUa));
                    }
                }
                if (fmts.length() > 0) {
                    org.json.JSONObject f = fmts.getJSONObject(0);
                    if (!f.optString("url", "").isEmpty()) {
                        return new ResolvedStream(f.optString("url"), f.optString("referer", providedReferer), f.optString("userAgent", providedUa));
                    }
                }
            }
            return new ResolvedStream(url, providedReferer, providedUa);
        } catch (Exception e) {
            return new ResolvedStream(initialUrl, providedReferer, providedUa);
        }
    }

    /* ==================== NATIVE BACKGROUND DOWNLOADER (GALLERY + MEDIASTORE) ==================== */

    private Uri insertMediaStoreEntry(ContentResolver resolver, String filename, String mimeType, boolean isStory) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q) return null;
        String sub = isStory ? "/Tayyar/Stories" : "/Tayyar";

        if (mimeType.startsWith("video/")) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Video.Media.DISPLAY_NAME, filename);
            values.put(MediaStore.Video.Media.MIME_TYPE, mimeType);
            values.put(MediaStore.Video.Media.RELATIVE_PATH, Environment.DIRECTORY_MOVIES + sub);
            values.put(MediaStore.Video.Media.IS_PENDING, 1);
            return resolver.insert(MediaStore.Video.Media.EXTERNAL_CONTENT_URI, values);
        }
        if (mimeType.startsWith("image/")) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Images.Media.DISPLAY_NAME, filename);
            values.put(MediaStore.Images.Media.MIME_TYPE, mimeType);
            values.put(MediaStore.Images.Media.RELATIVE_PATH, Environment.DIRECTORY_PICTURES + sub);
            values.put(MediaStore.Images.Media.IS_PENDING, 1);
            return resolver.insert(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values);
        }
        if (mimeType.startsWith("audio/")) {
            ContentValues values = new ContentValues();
            values.put(MediaStore.Audio.Media.DISPLAY_NAME, filename);
            values.put(MediaStore.Audio.Media.MIME_TYPE, mimeType);
            values.put(MediaStore.Audio.Media.RELATIVE_PATH, Environment.DIRECTORY_MUSIC + sub);
            values.put(MediaStore.Audio.Media.IS_PENDING, 1);
            return resolver.insert(MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, values);
        }
        ContentValues values = new ContentValues();
        values.put(MediaStore.Downloads.DISPLAY_NAME, filename);
        values.put(MediaStore.Downloads.MIME_TYPE, mimeType);
        values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + sub);
        values.put(MediaStore.Downloads.IS_PENDING, 1);
        return resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
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
                call.reject("BitTorrent magnet links require desktop torrent client");
                return;
            }

            String rawFilename = call.getString("filename");
            final String safeFilename = sanitizeFilename(rawFilename, url);
            final String referer = call.getString("referer", "");
            final String userAgent = call.getString("userAgent", "");
            final String mimeType = getMimeTypeForName(safeFilename);
            final boolean isAudio = mimeType.startsWith("audio/");
            final boolean isMedia = mimeType.startsWith("video/") || mimeType.startsWith("audio/") || mimeType.startsWith("image/");
            final boolean forUpdate = Boolean.TRUE.equals(call.getBoolean("forUpdate", false));

            // String downloadId avoids all JS Number <-> Java Long deserialization mismatches!
            final String downloadId = "dl_" + System.currentTimeMillis() + "_" + taskSeq.incrementAndGet();
            final NativeDownloadTask task = new NativeDownloadTask();
            task.id = downloadId;
            task.rawUrl = url;
            task.filename = safeFilename;
            task.referer = referer != null ? referer : "";
            task.userAgent = (userAgent != null && !userAgent.isEmpty()) ? userAgent : UA_CHROME_MOBILE;
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
                        ResolvedStream resolved = resolveDirectStreamIfNeeded(task.rawUrl, isAudio, task.referer, task.userAgent);
                        String targetUrl = resolved.url;
                        String activeReferer = resolved.referer;
                        String activeUa = resolved.userAgent;

                        // 2. Open HTTP connection following all redirects (including 307/308)
                        for (int hop = 0; hop < 8; hop++) {
                            URL u = new URL(targetUrl);
                            conn = (HttpURLConnection) u.openConnection();
                            conn.setInstanceFollowRedirects(false);
                            conn.setRequestProperty("User-Agent", activeUa);
                            conn.setRequestProperty("Accept", "*/*");
                            conn.setRequestProperty("Accept-Encoding", "identity");
                            if (activeReferer != null && !activeReferer.isEmpty()) {
                                conn.setRequestProperty("Referer", activeReferer);
                            }
                            conn.setConnectTimeout(15000);
                            conn.setReadTimeout(35000);

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

                        // Reject HTML error/login pages when downloading video/audio/image!
                        String respCt = conn.getContentType();
                        if (isMedia && respCt != null && respCt.toLowerCase().contains("text/html")) {
                            throw new Exception("Could not extract direct media stream (login or region restricted)");
                        }

                        task.total = conn.getContentLengthLong();
                        is = conn.getInputStream();

                        // 3. 3-Tier Bulletproof Storage: MediaStore Gallery -> MediaStore.Downloads -> FileOutputStream!
                        if (forUpdate) {
                            File updDir = context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                            if (updDir != null && !updDir.exists()) updDir.mkdirs();
                            directFile = new File(updDir, safeFilename);
                            if (directFile.exists()) directFile.delete();
                            os = new FileOutputStream(directFile);
                            task.savedPath = directFile.getAbsolutePath();
                        } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                            ContentResolver resolver = context.getContentResolver();
                            // Tier 1: Gallery-indexed MediaStore (Movies/Pictures/Music)
                            try {
                                mediaStoreUri = insertMediaStoreEntry(resolver, task.filename, task.mimeType, false);
                                if (mediaStoreUri != null) {
                                    os = resolver.openOutputStream(mediaStoreUri);
                                    String folder = task.mimeType.startsWith("video/") ? "Movies/Tayyar/"
                                        : task.mimeType.startsWith("image/") ? "Pictures/Tayyar/"
                                        : task.mimeType.startsWith("audio/") ? "Music/Tayyar/"
                                        : "Downloads/Tayyar/";
                                    task.savedPath = folder + task.filename;
                                }
                            } catch (Exception msEx) {
                                Log.w(TAG, "Primary MediaStore insert warning, falling back to Downloads: " + msEx.getMessage());
                                mediaStoreUri = null;
                                os = null;
                            }
                            // Tier 2: Safe fallback to MediaStore.Downloads
                            if (os == null) {
                                try {
                                    ContentValues dlVals = new ContentValues();
                                    dlVals.put(MediaStore.Downloads.DISPLAY_NAME, "Tayyar_" + System.currentTimeMillis() + "_" + task.filename);
                                    dlVals.put(MediaStore.Downloads.MIME_TYPE, task.mimeType);
                                    dlVals.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/Tayyar");
                                    dlVals.put(MediaStore.Downloads.IS_PENDING, 1);
                                    mediaStoreUri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, dlVals);
                                    if (mediaStoreUri != null) {
                                        os = resolver.openOutputStream(mediaStoreUri);
                                        task.savedPath = "Downloads/Tayyar/" + task.filename;
                                    }
                                } catch (Exception dlEx) {
                                    Log.w(TAG, "MediaStore.Downloads fallback warning: " + dlEx.getMessage());
                                    mediaStoreUri = null;
                                    os = null;
                                }
                            }
                        }

                        if (os == null) {
                            String dirType = task.mimeType.startsWith("video/") ? Environment.DIRECTORY_MOVIES
                                : task.mimeType.startsWith("image/") ? Environment.DIRECTORY_PICTURES
                                : task.mimeType.startsWith("audio/") ? Environment.DIRECTORY_MUSIC
                                : Environment.DIRECTORY_DOWNLOADS;
                            File pubDir = Environment.getExternalStoragePublicDirectory(dirType);
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
                            if (dt >= 300) {
                                long db = task.downloaded - lastBytes;
                                task.speed = (db / (double) dt) * 1000.0;
                                if (task.total > 0) {
                                    task.percent = (int) Math.min(99, (task.downloaded * 100L) / task.total);
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
                        } else if (task.downloaded <= 0) {
                            throw new Exception("Downloaded file was empty (0 bytes)");
                        } else {
                            if (mediaStoreUri != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                                ContentValues doneVals = new ContentValues();
                                doneVals.put(MediaStore.MediaColumns.IS_PENDING, 0);
                                context.getContentResolver().update(mediaStoreUri, doneVals, null, null);
                            }
                            if (directFile != null) {
                                MediaScannerConnection.scanFile(
                                    context,
                                    new String[] { directFile.getAbsolutePath() },
                                    new String[] { task.mimeType },
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
                        if (directFile != null && directFile.exists()) {
                            try { directFile.delete(); } catch (Exception ignored) {}
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
            Object rawId = call.getData() != null ? call.getData().opt("downloadId") : null;
            if (rawId == null) {
                call.reject("downloadId required");
                return;
            }
            String downloadId = String.valueOf(rawId);

            NativeDownloadTask task = activeTasks.get(downloadId);
            JSObject ret = new JSObject();
            if (task != null) {
                ret.put("downloadId", task.id);
                ret.put("downloaded", task.downloaded);
                ret.put("total", task.total);
                ret.put("speed", task.speed);
                ret.put("percent", task.percent);
                ret.put("status", task.status);
                ret.put("path", task.savedPath);
                ret.put("error", task.errorMsg);
            } else {
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
            Object rawId = call.getData() != null ? call.getData().opt("downloadId") : null;
            if (rawId != null) {
                NativeDownloadTask task = activeTasks.remove(String.valueOf(rawId));
                if (task != null) {
                    task.cancelled.set(true);
                }
            }
            JSObject ret = new JSObject();
            ret.put("ok", true);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject(e.getMessage());
        }
    }

    @PluginMethod
    public void installApk(PluginCall call) {
        try {
            String path = call.getString("path", "");
            if (path == null || path.trim().isEmpty()) {
                call.reject("APK path required");
                return;
            }
            File apkFile = new File(path);
            if (!apkFile.exists()) {
                call.reject("APK file not found: " + path);
                return;
            }
            Context context = getContext();
            Uri apkUri = FileProvider.getUriForFile(
                context,
                context.getPackageName() + ".fileprovider",
                apkFile
            );
            Intent intent = new Intent(Intent.ACTION_VIEW);
            intent.setDataAndType(apkUri, "application/vnd.android.package-archive");
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
            context.startActivity(intent);

            JSObject ret = new JSObject();
            ret.put("ok", true);
            call.resolve(ret);
        } catch (Exception e) {
            Log.e(TAG, "installApk error", e);
            call.reject("Could not launch installer: " + e.getMessage());
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
                    // 1. YouTube video ID check directly before redirects
                    final String ytId = extractYouTubeVideoId(rawUrl);
                    if (ytId != null) {
                        JSObject ytRes = resolveYouTube(ytId);
                        if (ytRes != null && ytRes.optBoolean("ok", false)) {
                            call.resolve(ytRes);
                            return;
                        }
                    }

                    final String url = resolveRedirects(rawUrl.trim());
                    JSObject res = null;

                    final String ytIdAfterRedirect = extractYouTubeVideoId(url);
                    if (ytIdAfterRedirect != null) {
                        res = resolveYouTube(ytIdAfterRedirect);
                    } else if (url.contains("tiktok.com")) {
                        res = resolveTikTok(url);
                    } else if (url.contains("facebook.com") || url.contains("fb.watch") || url.contains("fb.com")) {
                        res = resolveFacebook(url);
                    } else if (url.contains("instagram.com")) {
                        res = resolveInstagram(url);
                    } else if (url.contains("twitter.com") || url.contains("x.com")) {
                        res = resolveTwitter(url);
                    }

                    if (res != null) {
                        call.resolve(res);
                        return;
                    }

                    // OpenGraph video/image fallback for Snapchat spotlight or other sites (STRICT MEDIA VALIDATION)
                    String html = httpGetText(url, UA_CHROME_DESKTOP, "");
                    if (!html.isEmpty()) {
                        Matcher mv = Pattern.compile("<meta[^>]+property=[\"']og:video(?::secure_url|:url)?[\"'][^>]+content=[\"']([^\"']+)[\"']", Pattern.CASE_INSENSITIVE).matcher(html);
                        if (!mv.find()) {
                            mv = Pattern.compile("<meta[^>]+content=[\"']([^\"']+)[\"'][^>]+property=[\"']og:video(?::secure_url|:url)?[\"']", Pattern.CASE_INSENSITIVE).matcher(html);
                        }
                        if (mv.find()) {
                            String vUrl = mv.group(1).replace("&amp;", "&").trim();
                            String lowUrl = vUrl.toLowerCase();
                            boolean isEmbed = lowUrl.contains("/embed/") || lowUrl.contains("youtube.com") || lowUrl.contains("youtu.be") ||
                                              lowUrl.contains("facebook.com/plugins") || lowUrl.contains("instagram.com/p/") ||
                                              lowUrl.endsWith(".html") || lowUrl.endsWith(".htm");
                            boolean isMediaFile = lowUrl.endsWith(".mp4") || lowUrl.endsWith(".webm") || lowUrl.endsWith(".mov") ||
                                                  lowUrl.endsWith(".mkv") || lowUrl.contains("googlevideo.com") || lowUrl.contains("tikcdn.io") ||
                                                  lowUrl.contains("sc-cdn.net") || lowUrl.contains("fbcdn.net") || lowUrl.contains("cdninstagram.com") ||
                                                  lowUrl.contains("twimg.com") || lowUrl.contains("video.twimg.com");
                            if (!isEmbed && isMediaFile) {
                                JSArray formats = new JSArray();
                                JSObject f1 = new JSObject();
                                f1.put("id", "direct");
                                f1.put("quality", "Direct HD (MP4)");
                                f1.put("ext", "mp4");
                                f1.put("url", vUrl);
                                f1.put("directUrl", vUrl);
                                formats.put(f1);

                                JSObject ret = new JSObject();
                                ret.put("ok", true);
                                ret.put("platform", url.contains("snapchat.com") ? "Snapchat" : "Media");
                                ret.put("title", "Video");
                                ret.put("formats", formats);
                                call.resolve(ret);
                                return;
                            }
                        }
                    }

                    // Signal not resolved cleanly so JS fallback can try or direct file can proceed
                    JSObject ret = new JSObject();
                    ret.put("ok", false);
                    ret.put("error", "Could not extract video stream");
                    call.resolve(ret);
                } catch (Exception e) {
                    Log.e(TAG, "resolveSocialUrl error", e);
                    JSObject ret = new JSObject();
                    ret.put("ok", false);
                    ret.put("error", e.getMessage());
                    call.resolve(ret);
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
        String type;
        long size;
        long modified;
        String uri;
        String path;
        String source;
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
                        try {
                            mediaStoreUri = insertMediaStoreEntry(resolver, safeName, mimeType, true);
                            if (mediaStoreUri != null) {
                                os = resolver.openOutputStream(mediaStoreUri);
                                savedPath = (mimeType.startsWith("video/") ? "Movies" : "Pictures") + "/Tayyar/Stories/" + safeName;
                            }
                        } catch (Exception ignored) {
                            mediaStoreUri = null;
                            os = null;
                        }
                    }

                    if (os == null) {
                        String dirType = mimeType.startsWith("video/") ? Environment.DIRECTORY_MOVIES : Environment.DIRECTORY_PICTURES;
                        File pubDir = Environment.getExternalStoragePublicDirectory(dirType);
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
                        doneVals.put(MediaStore.MediaColumns.IS_PENDING, 0);
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

                    // 1. SNAPCHAT PUBLIC STORIES (Supports /@user, /add/user, story.snapchat.com/s/user & 308 redirects!)
                    if ("snapchat".equals(plat)) {
                        List<String> urlsToTry = new ArrayList<>();
                        if (rawInput.startsWith("http://") || rawInput.startsWith("https://")) {
                            urlsToTry.add(rawInput);
                            Matcher um = Pattern.compile("snapchat\\.com/(?:@|add/|s/|story/)([a-zA-Z0-9._-]+)", Pattern.CASE_INSENSITIVE).matcher(rawInput);
                            if (um.find()) detectedUser = um.group(1);
                        } else {
                            detectedUser = rawInput.replaceFirst("^@", "").split("[/?#]")[0].trim();
                            urlsToTry.add("https://www.snapchat.com/@" + URLEncoder.encode(detectedUser, "UTF-8"));
                            urlsToTry.add("https://www.snapchat.com/add/" + URLEncoder.encode(detectedUser, "UTF-8"));
                            urlsToTry.add("https://story.snapchat.com/s/" + URLEncoder.encode(detectedUser, "UTF-8"));
                        }

                        for (String u : urlsToTry) {
                            String html = httpGetText(u, UA_CHROME_DESKTOP, "https://www.snapchat.com/");
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

                    // 2. FACEBOOK STORIES (fdown.co.in + mobile HTML)
                    if ("facebook".equals(plat)) {
                        String targetUrl = rawInput.startsWith("http") ? rawInput
                            : "https://www.facebook.com/stories/" + URLEncoder.encode(rawInput.replaceFirst("^@", ""), "UTF-8") + "/";
                        JSObject fbRes = resolveFacebook(targetUrl);
                        if (fbRes != null && fbRes.has("formats")) {
                            org.json.JSONArray fmts = fbRes.getJSONArray("formats");
                            for (int i = 0; i < fmts.length(); i++) {
                                org.json.JSONObject f = fmts.getJSONObject(i);
                                String vUrl = f.optString("url", "");
                                if (!vUrl.isEmpty() && !seen.contains(vUrl)) {
                                    seen.add(vUrl);
                                    JSObject item = new JSObject();
                                    item.put("id", "fb_story_" + i);
                                    item.put("type", "video");
                                    item.put("url", vUrl);
                                    item.put("thumbnail", fbRes.optString("thumbnail", ""));
                                    item.put("ext", "mp4");
                                    item.put("filename", sanitizeFilename("Facebook_Story_" + (i + 1) + ".mp4", vUrl));
                                    stories.put(item);
                                }
                            }
                        }
                    }

                    // 3. INSTAGRAM STORIES (Direct + SnapInsta)
                    if ("instagram".equals(plat)) {
                        String targetUrl = rawInput.startsWith("http") ? rawInput
                            : "https://www.instagram.com/stories/" + URLEncoder.encode(rawInput.replaceFirst("^@", ""), "UTF-8") + "/";
                        JSObject igRes = resolveInstagram(targetUrl);
                        if (igRes != null && igRes.has("formats")) {
                            org.json.JSONArray fmts = igRes.getJSONArray("formats");
                            for (int i = 0; i < fmts.length(); i++) {
                                org.json.JSONObject f = fmts.getJSONObject(i);
                                String mUrl = f.optString("url", "");
                                String ext = f.optString("ext", "mp4");
                                if (!mUrl.isEmpty() && !seen.contains(mUrl)) {
                                    seen.add(mUrl);
                                    JSObject item = new JSObject();
                                    item.put("id", "ig_story_" + i);
                                    item.put("type", "jpg".equalsIgnoreCase(ext) ? "image" : "video");
                                    item.put("url", mUrl);
                                    item.put("thumbnail", igRes.optString("thumbnail", ""));
                                    item.put("ext", ext);
                                    item.put("filename", sanitizeFilename("Instagram_Story_" + (i + 1) + "." + ext, mUrl));
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
