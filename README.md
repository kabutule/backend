# MemorySpace

Java(Servlet/JSP) + React 기반 웹 애플리케이션입니다.

본 프로젝트는 **Tomcat + WAR 배포 방식**을 사용하며, 발표·실행 환경에서 **시스템 JAVA_HOME 설정 없이도 실행 가능**하도록 구성되어 있습니다.

---

## 📌 실행 환경

- **Java**: JDK 17 이상 (권장: JDK 21)
- **WAS**: Apache Tomcat 10.1.x
- **OS**: Windows 10 / 11

---

## 📁 배포 폴더 구조

```text
presentation/
 ├─ jdk-21/                  # JDK (압축 해제된 상태)
 │   └─ bin/java.exe
 │
 └─ apache-tomcat-10.1.xx/
     ├─ bin/
     │   ├─ catalina.bat
     │   ├─ startup.bat
     │   └─ setenv.bat        # Java 경로 지정 파일
     │
     └─ webapps/
         └─ MemorySpace.war   # 배포 파일
```

---

## ⚙️ setenv.bat 설정

`apache-tomcat-10.1.xx/bin/setenv.bat`

```bat
@echo off

set "JAVA_HOME=C:\presentation\jdk-21"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo [setenv] JAVA_HOME=%JAVA_HOME%
"%JAVA_HOME%\bin\java.exe" -version
```

> 💡 이 방식은 **시스템 환경 변수(JAVA_HOME)를 변경하지 않으며**, Tomcat 실행 시에만 지정된 JDK를 사용합니다.

---

## ▶️ 실행 방법

1. `apache-tomcat-10.1.xx/bin` 폴더로 이동
2. 해당 폴더에서 **cmd 실행**
3. 아래 명령어 입력

```bat
catalina.bat run
```

4. 콘솔에 아래와 같은 메시지가 출력되면 정상 실행

```text
INFO: Server startup in xxxx ms
```

5. 브라우저 접속

```
http://localhost:8080/MemorySpace
```

---

## 🗄 DB 연결 안내 (MySQL)

- 본 프로젝트는 **MySQL (JDBC)** 을 사용합니다.
- 실행 환경에 따라 다음 중 하나의 방식으로 DB를 준비해야 합니다.

### 1️⃣ 로컬 MySQL 사용

```text
jdbc:mysql://localhost:3306/DB명
```

- MySQL 서버 실행 필요
- 계정 및 권한 설정 필요

### 2️⃣ 외부 MySQL 서버 사용 (발표 환경 권장)

```text
jdbc:mysql://서버IP:3306/DB명
```

- 발표 PC에 MySQL 설치 불필요
- 네트워크 접근 가능해야 함

---

## ❗ 주의 사항

- `MemorySpace.war` 파일명은 **반드시 유지**해야 합니다.
- Tomcat 실행은 `startup.bat` 대신 `catalina.bat run` 사용을 권장합니다.
- 포트 8080이 이미 사용 중일 경우 Tomcat 실행이 실패할 수 있습니다.

---

## 🧠 기술 스택

- Frontend: React (SPA)
- Backend: Java Servlet / JSP (Jakarta EE)
- Server: Apache Tomcat 10.1
- DB: MySQL

---

## 📄 참고

- 본 프로젝트는 학교 과제 및 발표용으로 구성되었습니다.
- 실무 환경에서도 사용하는 **WAR + Tomcat 배포 방식**을 기반으로 합니다.

---

## 👤 Author

- 메가톤맨

