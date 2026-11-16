package com.mahbuobeh.tayyar;

import android.app.DownloadManager;
import android.content.Context;
import android.database.Cursor;
import android.net.Uri;
import android.os.Environment;
import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;

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

            String filename = call.getString("filename");
            if (filename == null || filename.trim().isEmpty()) {
                filename = Uri.parse(url).getLastPathSegment();
                if (filename == null || filename.isEmpty()) {
                    filename = "tayyar_download_" + System.currentTimeMillis();
                }
            }

            Context context = getContext();
            DownloadManager dm = (DownloadManager) context.getSystemService(Context.DOWNLOAD_SERVICE);
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));

            request.setTitle(filename);
            request.setDescription("Tayyar Download");
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);

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
            request.addRequestHeader("User-Agent", "Tayyar/1.0.0 (Android)");

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
                long total = totalBytesIdx >= 0 ? c.getLong(totalBytesIdx) : 0;
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
}
