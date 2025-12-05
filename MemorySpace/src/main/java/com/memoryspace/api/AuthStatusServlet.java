package com.memoryspace.api;

import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 현재 로그인 상태를 JSON으로 내려주는 서블릿.
 *
 * 응답 예시:
 *   { "loggedIn": false }
 *   { "loggedIn": true, "userId": "star123", "nickname": "BlueStar", "role": "ADMIN" }
 */
@WebServlet("/api/auth/me")
public class AuthStatusServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        resp.setContentType("application/json; charset=UTF-8");

        HttpSession session = req.getSession(false);

        try (PrintWriter out = resp.getWriter()) {
            if (session == null) {
                out.write("{\"loggedIn\": false}");
                return;
            }

            String loginId = (String) session.getAttribute("loginId");
            if (loginId == null) {
                out.write("{\"loggedIn\": false}");
                return;
            }

            String nickname = (String) session.getAttribute("nickname");
            String role = (String) session.getAttribute("role");

            StringBuilder sb = new StringBuilder();
            sb.append("{\"loggedIn\": true");
            sb.append(", \"userId\": \"").append(escapeJson(loginId)).append("\"");
            if (nickname != null) {
                sb.append(", \"nickname\": \"").append(escapeJson(nickname)).append("\"");
            }
            if (role != null) {
                sb.append(", \"role\": \"").append(escapeJson(role)).append("\"");
            }
            sb.append("}");
            out.write(sb.toString());
        }
    }

    private String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}
