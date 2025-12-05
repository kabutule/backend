package com.memoryspace.api;

import com.memoryspace.user.UserDAO;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.*;

import java.io.IOException;
import java.io.PrintWriter;

/**
 * 회원가입 처리 서블릿
 * 프론트에서 보내는 파라미터:
 *   id, password, name, email, region
 *
 * 응답(JSON):
 *   { "success": true }
 *   { "success": false, "message": "..." }
 */
@WebServlet("/api/signup")
public class SignUpServlet extends HttpServlet {

    private UserDAO userDAO;

    @Override
    public void init() throws ServletException {
        this.userDAO = new UserDAO();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws IOException {

        req.setCharacterEncoding("UTF-8");
        resp.setContentType("application/json; charset=UTF-8");

        String id = req.getParameter("id");           // username
        String password = req.getParameter("password"); // passwordHash
        String name = req.getParameter("name");       // nickname
        String email = req.getParameter("email");
        String region = req.getParameter("region");   // liveIn

        boolean success = false;
        String message = null;

        if (isBlank(id) || isBlank(password) || isBlank(name) || isBlank(email)) {
            message = "All required fields must be filled in.";
        } else if (userDAO.isUserIdExists(id)) {
            message = "This ID is already in use.";
        } else if (userDAO.isEmailExists(email)) {
            message = "This email is already registered.";
        } else {
            // 👇 여기서 DB 컬럼 기준으로 맞춰서 넘김
            success = userDAO.createUser(id, password, name, email, region);
            if (!success) {
                message = "Failed to create user.";
            }
        }

        try (PrintWriter out = resp.getWriter()) {
            if (success) {
                out.write("{\"success\": true}");
            } else {
                if (message == null) {
                    message = "Unknown error";
                }
                message = message.replace("\\", "\\\\").replace("\"", "\\\"");
                out.write("{\"success\": false, \"message\": \"" + message + "\"}");
            }
        }
    }

    private boolean isBlank(String s) {
        return s == null || s.trim().isEmpty();
    }
}
