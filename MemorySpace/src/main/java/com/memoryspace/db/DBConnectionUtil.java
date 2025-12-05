package com.memoryspace.db;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnectionUtil {

    // 🔥 여기 네 MySQL 접속 정보에 맞게 수정
    private static final String URL =
            "jdbc:mysql://localhost:3306/memoryspace?serverTimezone=Asia/Seoul&useSSL=false";
    private static final String USER = "memory_user";      // 위에서 만든 계정
    private static final String PASSWORD = "1234";      // 계정 비번

    static {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");   // MySQL 8.x 드라이버
        } catch (ClassNotFoundException e) {
            throw new RuntimeException("MySQL JDBC 드라이버 로드 실패", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}
