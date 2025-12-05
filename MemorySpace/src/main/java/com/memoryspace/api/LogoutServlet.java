// src/main/java/com/memoryspace/api/LogoutServlet.java
package com.memoryspace.api;

import com.memoryspace.db.DBConnectionUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

/**
 * 로그아웃 처리 서블릿.
 *
 * 세션을 무효화하고 login_log 테이블의 logout_time 을 채워준다.
 *
 * 응답(JSON):
 *   { "success": true }
 */
@WebServlet("/api/logout")
public class LogoutServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json; charset=UTF-8");

        HttpSession session = req.getSession(false);
        Long logId = null;

        if (session != null) {
            Object logObj = session.getAttribute("loginLogId");
            if (logObj instanceof Long) {
                logId = (Long) logObj;
            } else if (logObj instanceof Number) {
                logId = ((Number) logObj).longValue();
            }
            session.invalidate();
        }

        // login_log 의 logout_time 업데이트
        if (logId != null && logId > 0) {
            updateLogoutTime(logId);
        }

        try (PrintWriter out = resp.getWriter()) {
            out.write("{\"success\": true}");
        }
    }

    private void updateLogoutTime(long logId) {
        String sql = "UPDATE login_log SET logout_time = NOW() WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setLong(1, logId);
            pstmt.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
