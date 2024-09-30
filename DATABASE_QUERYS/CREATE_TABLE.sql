use sol;
-- ----------------------------------------
-- ----------------------------------------
-- ----------------USER--------------------
-- ----------------------------------------
-- ----------------------------------------
/* 기존 데이터에서 ' 삭제
    ALTER가 아닌 테이블 생성시 PK, FK 지정
    테이블 생성 순서 고려해서 slumberUser 테이블 위치 이동
*/
CREATE TABLE User (
   user_no   int   NOT NULL AUTO_INCREMENT,
   user_id   varchar(256)   NOT NULL UNIQUE,
   status    varchar(50)    NULL, -- 유저 상태를 나타내는 컬럼 추가
   PRIMARY KEY (user_no)
);

CREATE TABLE UserProfile (
   profile_no   int   NOT NULL AUTO_INCREMENT,
   user_no   int   NOT NULL UNIQUE,
   nickname   varchar(50)   NULL,
   image_url   varchar(512)   NULL,
   introduce   varchar(512)   NULL,
   PRIMARY KEY (profile_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE
);

CREATE TABLE Session (
   login_no  int   NOT NULL AUTO_INCREMENT,
   user_no   int   NOT NULL,
   login_time   datetime   NULL,
   logout_time   datetime   NULL,
   ip_address   varchar(50)   NULL,
   fail_count   int   NULL,
   fail_reason   varchar(128)   NULL,
   status_code   int   NULL,
   PRIMARY KEY (login_no, user_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no)
);

CREATE TABLE Authentic (
   auth_no   int   NOT NULL AUTO_INCREMENT,
   user_no   int   NOT NULL,
   gender   int   NULL,
   phone   varchar(128)   NULL,
   email   varchar(128)   NULL,
   birthdate   varchar(128)   NULL,
   auth_date   datetime   NULL,
   address   varchar(128)   NULL,
   PRIMARY KEY (auth_no, user_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE
);

CREATE TABLE Password (
   password_no   int   NOT NULL AUTO_INCREMENT,
   user_no   int   NOT NULL,
   salt   varchar(128)   NULL,
   password   varchar(128)   NULL,
   update_date   datetime   NULL,
   PRIMARY KEY (password_no, user_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE
);

-- 팔로워(친구) 테이블 --
CREATE TABLE UserFollower (
    follower_no int NOT NULL,
    following_no int NOT NULL,
    follow_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_no, following_no),
    FOREIGN KEY (follower_no) REFERENCES User(user_no) ON DELETE CASCADE,
    FOREIGN KEY (following_no) REFERENCES User(user_no) ON DELETE CASCADE
);

CREATE TABLE slumberUser (
   sl_user_no   int   NOT NULL,
   sl_user_id   varchar(128)   NULL,
   PRIMARY KEY (sl_user_no)
);
ALTER TABLE slumberUser ADD status ENUM('active', 'dormant', 'withdrawn') DEFAULT 'active';


CREATE TABLE slumberUserProfile (
   sl_profile_no   int   NOT NULL AUTO_INCREMENT,
   sl_user_no   int   NOT NULL,
   sl_nickname   varchar(50)   NULL,
   sl_image_url   varchar(128)   NULL,
   sl_introduce   varchar(256)   NULL,
   PRIMARY KEY (sl_profile_no, sl_user_no),
   FOREIGN KEY (sl_user_no) REFERENCES slumberUser(sl_user_no)
);

CREATE TABLE slumberUserAuthentic (
   sl_auth_no   int   NOT NULL AUTO_INCREMENT,
   sl_user_no   int   NOT NULL,
   sl_gender   int   NULL,
   sl_phone   varchar(128)   NULL,
   sl_email   varchar(128)   NULL,
   sl_birthdate   varchar(128)   NULL,
   sl_auth_date   datetime   NULL,
   sl_address   varchar(128)   NULL,
   PRIMARY KEY (sl_auth_no, sl_user_no),
   FOREIGN KEY (sl_user_no) REFERENCES slumberUser(sl_user_no)
);

CREATE TABLE slumberUserPassword (
   sl_password_no   int   NOT NULL AUTO_INCREMENT,
   sl_user_no   int   NOT NULL,
   sl_salt   varchar(128)   NULL,
   sl_password   varchar(128)   NULL,
   sl_update_date   datetime   NULL,
   PRIMARY KEY (sl_password_no, sl_user_no),
   FOREIGN KEY (sl_user_no) REFERENCES slumberUser(sl_user_no)
);

CREATE TABLE withdrawalUserlog (
   wu_log_no   int   NOT NULL AUTO_INCREMENT,
   ci   varchar(128)   NULL,
   wu_status_code   int   NULL,
   wu_reason   varchar(128)   NULL,
   wu_date   datetime   NULL,
   wu_id   varchar(128)   NULL,
   PRIMARY KEY (wu_log_no)
);



-- ----------------------------------------
-- ----------------------------------------
-- -----------------BOARD------------------
-- ----------------------------------------
-- ----------------------------------------

-- 게시판 종류
create table board_info_table(
   board_info_id INT  primary key  AUTO_INCREMENT,
   board_info_name VARCHAR(1024) NOT NULL,
   board_img VARCHAR(1024)
);


-- 유저-게시판종류 테이블 (User와 board_info_table 간의 다대다 관계를 관리)
CREATE TABLE UserBoard (
   user_no INT NOT NULL,
   board_info_id INT NOT NULL,
   PRIMARY KEY (user_no, board_info_id),
   FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE,
   FOREIGN KEY (board_info_id) REFERENCES board_info_table(board_info_id) ON DELETE CASCADE
);
-- 게시글
CREATE TABLE posts (
   post_id INT PRIMARY KEY AUTO_INCREMENT,
   post_text TEXT,
   user_no INT,
   createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
   modiDate DATETIME DEFAULT NULL,
   board_info_id INT,
   isDeleted TINYINT DEFAULT 0,
   views INT DEFAULT 0,
   FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE SET NULL,
   FOREIGN KEY (board_info_id) REFERENCES board_info_table(board_info_id) ON DELETE SET NULL
);

-- 게시글 파일 테이블 
CREATE TABLE post_files (
   file_id INT PRIMARY KEY AUTO_INCREMENT,
   post_id INT,
   file_path VARCHAR(1024) NOT NULL,
   upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE
);

-- 게시글 좋아요
CREATE TABLE post_likes (
    p_like_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT,
    user_no INT,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE SET NULL,
    UNIQUE (user_no, post_id)
);

-- 댓글
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT, 
    post_id INT,
    parent_comment_id INT DEFAULT NULL,
    comment_text TEXT NOT NULL,
    user_no INT,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    modiDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    isDeleted TINYINT DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE SET NULL 
);

-- 댓글 파일 테이블 
CREATE TABLE comments_files (
   comments_file_id INT PRIMARY KEY AUTO_INCREMENT,
   comment_id INT,
   comments_file_path VARCHAR(1024) NOT NULL,
   upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE
);

-- 댓글 좋아요
CREATE TABLE comment_likes (
    c_like_id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT,
    user_no INT,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE SET NULL,
    UNIQUE (user_no, comment_id)
);

-- 북마크
CREATE TABLE bookmarks (
   bookmark_id INT PRIMARY KEY AUTO_INCREMENT,
   user_no INT,
   post_id INT,
   createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE,
   FOREIGN KEY (post_id) REFERENCES posts(post_id) ON DELETE CASCADE,
   UNIQUE (user_no, post_id)
);

-- 신고 테이블
CREATE TABLE reported_posts (
    report_id INT AUTO_INCREMENT PRIMARY KEY,  
    post_id INT NOT NULL, 
    user_no INT NOT NULL, 
    report_reason ENUM('불법 콘텐츠', '스팸', '모욕적 언어', '기타') NOT NULL,
    other_reason VARCHAR(255),  
    report_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
    status ENUM('처리 대기', '처리 완료', '무효') DEFAULT '처리 대기', 
    FOREIGN KEY (post_id) REFERENCES posts(post_id), 
    FOREIGN KEY (user_no) REFERENCES User(user_no) 
);

-- ----------------------------------------
-- ----------------------------------------
-- -----------------CHAT------------------
-- ----------------------------------------
-- ----------------------------------------
-- 기존 데이터에서 ' 삭제
-- ChatRoomUser 테이블 last_active_at 컬럼 null 불가 -> 허용 

CREATE TABLE ChatRoom (
    room_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    room_name VARCHAR(255) DEFAULT NULL,
    is_group BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ChatRoomUser (
    room_id BIGINT UNSIGNED NOT NULL,
    user_no INT NOT NULL,
    role ENUM('admin', 'member') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES ChatRoom(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE,
    UNIQUE KEY uq_room_user (room_id, user_no)
);

CREATE TABLE ChatMessage (
    message_id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    room_id BIGINT UNSIGNED NOT NULL,
    user_no INT NOT NULL,
    message_content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('sent', 'delivered', 'read') DEFAULT 'sent',
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY (room_id) REFERENCES ChatRoom(room_id) ON DELETE CASCADE,
    FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE,
    INDEX idx_room_id (room_id),
    INDEX idx_user_no (user_no)
);

-- 인증용 토큰 저장용
create table refreshTokens(
user_no int not null,
token varchar(256) not null,
foreign key(user_no) references user(user_no)
);

-- 알림과 공지사항--
CREATE TABLE Notifications (
  notification_id INT PRIMARY KEY AUTO_INCREMENT,
  user_no INT,
  message TEXT,
  type VARCHAR(50), -- 'alert', 'announcement' 등
  is_read BOOLEAN DEFAULT FALSE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_no) REFERENCES User(user_no) ON DELETE CASCADE
);
CREATE TABLE Announcements (
  announcement_id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
-- 로그인 로그 테이블
CREATE TABLE LoginLog (
   log_id        int      AUTO_INCREMENT PRIMARY KEY,  -- 로그 ID
   user_id       varchar(256)    NOT NULL,                    -- 유저 id 
   login_time    DATETIME        NOT NULL,                    -- 로그인 시간
   login_status  ENUM('SUCCESS', 'FAIL') NOT NULL,            -- 로그인 성공 여부
   FOREIGN KEY (user_id) REFERENCES User(user_id)             -- User 테이블과 연결
);


select * from Loginlog;
