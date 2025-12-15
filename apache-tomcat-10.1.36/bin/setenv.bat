@echo off

REM ===== JDK 절대 경로 설정 =====
REM ⚠️ 본인 JDK 실제 경로로 수정
set "JAVA_HOME=C:\presentation\jdk-21"

REM ===== Java 실행 경로 추가 =====
set "PATH=%JAVA_HOME%\bin;%PATH%"

REM ===== 확인용 출력 (문제 생기면 도움됨) =====
echo [setenv] JAVA_HOME=%JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version
