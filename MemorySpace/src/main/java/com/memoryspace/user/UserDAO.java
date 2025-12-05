package com.memoryspace.user;

import com.memoryspace.db.DBConnectionUtil;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 사용자와 관련된 DB 작업을 담당하는 DAO.
 *
 * users 테이블 구조:
 *
 *   users (
 *     id           BIGINT AUTO_INCREMENT PRIMARY KEY,
 *     username     VARCHAR(..) UNIQUE NOT NULL,
 *     passwordHash VARCHAR(..) NOT NULL,
 *     nickname     VARCHAR(..) NOT NULL,
 *     email        VARCHAR(..) UNIQUE NOT NULL,
 *     liveIn       VARCHAR(..),
 *     role         ENUM('USER','ADMIN') DEFAULT 'USER'
 *   )
 */
public class UserDAO {

    // 로그인 체크 (username + passwordHash)
    public boolean checkLogin(String username, String password) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ? AND passwordHash = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            pstmt.setString(2, password);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    int count = rs.getInt(1);
                    return count == 1;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // username 중복 여부 확인
    public boolean isUserIdExists(String username) {
        String sql = "SELECT COUNT(*) FROM users WHERE username = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // email 중복 여부 확인
    public boolean isEmailExists(String email) {
        String sql = "SELECT COUNT(*) FROM users WHERE email = ?";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, email);

            try (ResultSet rs = pstmt.executeQuery()) {
                if (rs.next()) {
                    return rs.getInt(1) > 0;
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    // 회원가입 (INSERT)
    public boolean createUser(String username,
                              String password,
                              String nickname,
                              String email,
                              String liveIn) {

        // role은 DEFAULT 'USER'로 둠
        String sql = "INSERT INTO users (username, passwordHash, nickname, email, liveIn) " +
                     "VALUES (?, ?, ?, ?, ?)";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            pstmt.setString(2, password);
            pstmt.setString(3, nickname);
            pstmt.setString(4, email);
            pstmt.setString(5, liveIn);

            int rows = pstmt.executeUpdate();
            return rows == 1;

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }
}
