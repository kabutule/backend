package com.memoryspace.api;

import com.memoryspace.db.DBConnectionUtil;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

/**
 * 로그인 처리 서블릿
 *
 * 요청 파라미터:
 *   id, password
 *
 * 응답(JSON):
 *   { "success": true, "userId": "...", "nickname": "...", "role": "ADMIN|USER" }
 */
@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");

        String id = req.getParameter("id");           // username
        String password = req.getParameter("password"); // passwordHash

        boolean success = false;
        String nickname = null;
        String role = null;

        if (!isBlank(id) && !isBlank(password)) {
            // 🔧 여기서 컬럼명 수정
            String sql = "SELECT nickname, role FROM users " +
                         "WHERE username = ? AND passwordHash = ?";

            try (Connection conn = DBConnectionUtil.getConnection();
                 PreparedStatement pstmt = conn.prepareStatement(sql)) {

                pstmt.setString(1, id);
                pstmt.setString(2, password);

                try (ResultSet rs = pstmt.executeQuery()) {
                    if (rs.next()) {
                        success = true;
                        nickname = rs.getString("nickname");
                        role = rs.getString("role");
                    }
                }
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }

        try (PrintWriter out = resp.getWriter()) {
            if (success) {
                if (role == null || role.isBlank()) {
                    role = "USER";
                }

                HttpSession session = req.getSession(true);
                session.setAttribute("loginId", id);      // username
                session.setAttribute("nickname", nickname);
                session.setAttribute("role", role);

                long logId = insertLoginLog(id); // login_log.user_id 에 username 저장
                if (logId > 0) {
                    session.setAttribute("loginLogId", logId);
                }

                StringBuilder sb = new StringBuilder();
                sb.append("{\"success\": true");
                sb.append(", \"userId\": \"").append(escapeJson(id)).append("\"");
                if (nickname != null) {
                    sb.append(", \"nickname\": \"").append(escapeJson(nickname)).append("\"");
                }
                sb.append(", \"role\": \"").append(escapeJson(role)).append("\"");
                sb.append("}");
                out.write(sb.toString());
            } else {
                out.write("{\"success\": false, \"message\": \"Invalid id or password\"}");
            }
        }
    }

    // login_log 테이블 구조는 이미 user_id 컬럼이 있으니 그대로 사용
    private long insertLoginLog(String userId) {
        String sql = "INSERT INTO login_log (user_id, login_time) VALUES (?, NOW())";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, userId);
            pstmt.executeUpdate();

            try (ResultSet rs = pstmt.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getLong(1);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return -1;
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
