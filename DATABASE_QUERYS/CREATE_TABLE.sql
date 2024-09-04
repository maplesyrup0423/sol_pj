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
   user_no   int   NOT NULL,
   user_id   varchar(256)   NULL,
   PRIMARY KEY (user_no)
);

CREATE TABLE UserProfile (
   profile_no   int   NOT NULL,
   user_no   int   NOT NULL,
   nickname   varchar(50)   NULL,
   image_url   varchar(128)   NULL,
   introduce   varchar(256)   NULL,
   PRIMARY KEY (profile_no, user_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no)
);

CREATE TABLE Session (
   login_no  int   NOT NULL,
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
   auth_no   int   NOT NULL,
   user_no   int   NOT NULL,
   gender   int   NULL,
   phone   varchar(128)   NULL,
   email   varchar(128)   NULL,
   birthdate   varchar(128)   NULL,
   auth_date   datetime   NULL,
   address   varchar(128)   NULL,
   PRIMARY KEY (auth_no, user_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no)
);

CREATE TABLE Password (
   password_no   int   NOT NULL,
   user_no   int   NOT NULL,
   salt   varchar(128)   NULL,
   password   varchar(128)   NULL,
   update_date   datetime   NULL,
   PRIMARY KEY (password_no, user_no),
   FOREIGN KEY (user_no) REFERENCES User(user_no)
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

CREATE TABLE slumberUserProfile (
   sl_profile_no   int   NOT NULL,
   sl_user_no   int   NOT NULL,
   sl_nickname   varchar(50)   NULL,
   sl_image_url   varchar(128)   NULL,
   sl_introduce   varchar(256)   NULL,
   PRIMARY KEY (sl_profile_no, sl_user_no),
   FOREIGN KEY (sl_user_no) REFERENCES slumberUser(sl_user_no)
);

CREATE TABLE slumberUserAuthentic (
   sl_auth_no   int   NOT NULL,
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
   sl_password_no   int   NOT NULL,
   sl_user_no   int   NOT NULL,
   sl_salt   varchar(128)   NULL,
   sl_password   varchar(128)   NULL,
   sl_update_date   datetime   NULL,
   PRIMARY KEY (sl_password_no, sl_user_no),
   FOREIGN KEY (sl_user_no) REFERENCES slumberUser(sl_user_no)
);

CREATE TABLE withdrawalUserlog (
   wu_log_no   int   NOT NULL,
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
/* NOT NULL 지정, DEFAULT값 추가 
    TINYINT 디스플레이 폭 지정 삭제
    modiDate에 ON UPDATE CURRENT_TIMESTAMP 추가*/
-- 게시판 종류
create table board_info_table(
   board_info_id INT  primary key,
   board_info_name VARCHAR(1024) NOT NULL,
   board_img VARCHAR(1024)
);

-- 게시글
CREATE TABLE posts(
   post_id INT PRIMARY KEY AUTO_INCREMENT,
   post_text VARCHAR(1024)NOT NULL,
   user_no INT,
   createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
   modiDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
   board_info_id INT,
   isDeleted TINYINT DEFAULT 0,
   views INT DEFAULT 0,
   foreign key (user_no) references User(user_no),
   foreign key (board_info_id) references board_info_table(board_info_id)
);

-- 게시글 파일 테이블 
CREATE TABLE post_files (
   file_id INT PRIMARY KEY AUTO_INCREMENT,
   post_id INT,
   file_path VARCHAR(1024) NOT NULL,
   upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (post_id) REFERENCES posts(post_id) 
);

-- 게시글 좋아요
CREATE TABLE post_likes (
    p_like_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT,
    user_no INT,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ,
    FOREIGN KEY (user_no) REFERENCES User(user_no) 
);

-- 댓글
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT, 
    post_id INT,
    parent_comment_id INT DEFAULT NULL,
    comment_text VARCHAR(1024) NOT NULL,
    user_no INT,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    modiDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    isDeleted TINYINT DEFAULT 0,
    foreign key (post_id) references posts(post_id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(comment_id),
    foreign key (user_no) references User(user_no)
);
-- 댓글 좋아요
CREATE TABLE comment_likes (
    c_like_id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT,
    user_no INT,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ,
    FOREIGN KEY (user_no) REFERENCES User(user_no) 
);

-- 파일 백업 테이블
-- CREATE TABLE post_files_backup (
--     backup_id INT PRIMARY KEY AUTO_INCREMENT,
--     file_id INT,
--     post_id INT,
--     file_path VARCHAR(1024),
--     delete_date DATETIME DEFAULT CURRENT_TIMESTAMP, 
--     original_upload_date DATETIME 
-- );
-- 게시글 백업 테이블
-- CREATE TABLE posts_backup (
--     backup_id INT PRIMARY KEY AUTO_INCREMENT,
--     original_post_id INT,
--     post_text VARCHAR(1024),
--     post_file1 VARCHAR(1024),
--     post_file2 VARCHAR(1024),
--     post_file3 VARCHAR(1024),
--     post_file4 VARCHAR(1024),
--     user_no INT,
--     createDate DATETIME,
--     modiDate DATETIME,
--     board_info_id INT,
--     isDeleted TINYINT,
--     views INT,
--     likes_count INT,
--     backup_date DATETIME DEFAULT CURRENT_TIMESTAMP
-- );

-- 댓글 백업 테이블
-- CREATE TABLE comments_backup (
--     backup_id INT PRIMARY KEY AUTO_INCREMENT,
--     original_comment_id INT,
--     post_id INT,
--     parent_comment_id INT,
--     comment_text VARCHAR(1024),
--     user_no INT,
--     createDate DATETIME,
--     modiDate DATETIME,
--     isDeleted TINYINT,
--     likes_count INT,
--     backup_date DATETIME DEFAULT CURRENT_TIMESTAMP
-- );


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
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
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




