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

create table board_info_table(
   board_info_id INT  primary key,
   board_info_name VARCHAR(1024) NOT NULL
);


CREATE TABLE posts(
   post_id INT PRIMARY KEY AUTO_INCREMENT,
   post_text VARCHAR(1024)NOT NULL,
   post_file1 VARCHAR(1024) DEFAULT NULL,
   post_file2 VARCHAR(1024) DEFAULT NULL,
   post_file3 VARCHAR(1024) DEFAULT NULL,
   post_file4 VARCHAR(1024) DEFAULT NULL,
   user_no INT,
   createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
   modiDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
   board_info_id INT,
   isDeleted TINYINT DEFAULT 0,
   views INT DEFAULT 0,
   likes_count INT DEFAULT 0,
   foreign key (user_no) references User(user_no),
   foreign key (board_info_id) references board_info_table(board_info_id)
);

CREATE TABLE post_likes (
    p_like_id INT PRIMARY KEY AUTO_INCREMENT,
    post_id INT,
    user_no INT,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(post_id) ,
    FOREIGN KEY (user_no) REFERENCES User(user_no) 
);


CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT, 
    post_id INT,
    parent_comment_id INT DEFAULT NULL,
    comment_text VARCHAR(1024) NOT NULL,
    user_no INT,
    createDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    modiDate DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    isDeleted TINYINT DEFAULT 0,
    likes_count INT DEFAULT 0,
    foreign key (post_id) references posts(post_id),
    FOREIGN KEY (parent_comment_id) REFERENCES Comments(comment_id),
    foreign key (user_no) references User(user_no)
);

CREATE TABLE comment_likes (
    c_like_id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT,
    user_no INT,
    like_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (comment_id) REFERENCES comments(comment_id) ,
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
   room_id varchar(256) NOT NULL,
   room_name varchar(256) NOT NULL,
   PRIMARY KEY (room_id)
);

CREATE TABLE ChatRoomUser (
   room_id varchar(256) NOT NULL,
   user_no int NOT NULL,
   role varchar(256) NULL,
   joined_at datetime NOT NULL,
   last_active_at datetime  NULL,
   PRIMARY KEY (room_id, user_no),
   FOREIGN KEY (room_id) REFERENCES ChatRoom(room_id),
   FOREIGN KEY (user_no) REFERENCES user(user_no)
);

CREATE TABLE ChatMessage (
   message_id varchar(256) NOT NULL,
   room_id varchar(256) NOT NULL,
   user_no int NOT NULL,
   message_content varchar(256) NOT NULL,
   created_at datetime NOT NULL,
   status varchar(50) NULL,
   PRIMARY KEY (message_id),
   FOREIGN KEY (room_id) REFERENCES ChatRoom(room_id),
   FOREIGN KEY (user_no) REFERENCES user(user_no)
);




