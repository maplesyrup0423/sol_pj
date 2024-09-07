-- 아래 insert문은 
-- user_no가 1~6 까지 데이터가있으며
-- board_info_id가 1~4까지 데이터가 있다는 전제 하에 동작한다.
-- 테스트이미지도 서버에 있어야 깨지지 않는다.

USE sol;

-- 게시판
INSERT INTO board_info_table (board_info_name, board_img) 
VALUES('리그 오브 레전드','League of Legends.png');
INSERT INTO board_info_table (board_info_name, board_img) 
VALUES('로스트 아크','LOST ARK.png');
INSERT INTO board_info_table (board_info_name, board_img) 
VALUES('배틀 그라운드','PUBG BATTLEGROUNDS.png');
INSERT INTO board_info_table (board_info_name, board_img) 
VALUES('발로란트','VALORANT.png');

--  게시글이랑 파일
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('1번게시판 1번 게시글', 1, 1);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg1.png'),
       (LAST_INSERT_ID(), 'testImg2.jpg'),
       (LAST_INSERT_ID(), 'testImg3.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('1번게시판  2번 게시글', 2, 1);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg4.jpg'),
       (LAST_INSERT_ID(), 'testImg5.jpg'),
       (LAST_INSERT_ID(), 'testImg6.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('1번게시판  3번 게시글', 3, 1);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg7.jpg'),
       (LAST_INSERT_ID(), 'testImg8.jpg'),
       (LAST_INSERT_ID(), 'testImg9.jpg'),
       (LAST_INSERT_ID(), 'testImg10.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('1번게시판  4번 게시글', 4, 1);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg11.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('1번게시판  5번 게시글', 5, 1);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('2번게시판 1번 게시글', 5, 2);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg1.png'),
       (LAST_INSERT_ID(), 'testImg2.jpg'),
       (LAST_INSERT_ID(), 'testImg3.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('2번게시판  2번 게시글', 2, 2);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg4.jpg'),
       (LAST_INSERT_ID(), 'testImg5.jpg'),
       (LAST_INSERT_ID(), 'testImg6.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('2번게시판  3번 게시글', 6, 2);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('2번게시판  4번 게시글', 2, 2);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg11.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('3번게시판  1번 게시글', 1, 3);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('3번게시판  2번 게시글', 2, 3);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('3번게시판  3번 게시글', 5, 3);
INSERT INTO post_files (post_id, file_path)
VALUES (LAST_INSERT_ID(), 'testImg15.jpg');
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('3번게시판  4번 게시글', 4, 3);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('3번게시판  5번 게시글', 4, 3);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('4번게시판  1번 게시글', 4, 4);

-- 게시글 /파일/ 댓글
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('안녕하세요~', 1, 1);
SET @post_id = LAST_INSERT_ID();
INSERT INTO post_files (post_id, file_path)
VALUES (@post_id, 'testImg4.jpg'),
       (@post_id, 'testImg10.jpg'),
       (@post_id, 'testImg6.jpg');
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,NULL,'댓글1: 안녕하세염',5);
SET @comments_id1 = LAST_INSERT_ID();
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,@comments_id1,'댓글1-1 : 말투 왜그럼;;',2);
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,@comments_id1,'댓글1-2:ㄹㅇㅋㅋ 안제쩍 말투임 ㅋㅋ',3);
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,LAST_INSERT_ID(),'댓글1-2-1: 시비걸지마셈',5);
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,NULL,'댓글2: 네 안녕하세요',6);
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,LAST_INSERT_ID(),'댓글2-1: 네네 잘부탁드립니다.',1);
SET @comments_id2_1 = LAST_INSERT_ID();
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,@comments_id2_1,'댓글2-1-1: 오 사회생활말투',6);
INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(@post_id,@comments_id2_1,'댓글2-1-2: 딱딱한 사람인듯',3);

-- 게시글 좋아요
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('좋아요 테스트1', 2, 1);
INSERT INTO post_likes(post_id,user_no)
VALUES (LAST_INSERT_ID(),1),
       (LAST_INSERT_ID(),3),
       (LAST_INSERT_ID(),4),
       (LAST_INSERT_ID(),5),
       (LAST_INSERT_ID(),6);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('좋아요 테스트2', 1, 1);
INSERT INTO post_likes(post_id,user_no)
VALUES (LAST_INSERT_ID(),2),
       (LAST_INSERT_ID(),3),
       (LAST_INSERT_ID(),4);
INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('좋아요 테스트3', 3, 1);
INSERT INTO post_likes(post_id,user_no)
VALUES (LAST_INSERT_ID(),2);       

