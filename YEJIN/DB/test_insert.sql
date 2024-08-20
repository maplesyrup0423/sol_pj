USE sol;

INSERT INTO User VALUES(1,'예진');
INSERT INTO User VALUES(2,'일진');
INSERT INTO User VALUES(3,'한결');
INSERT INTO User VALUES(4,'유한');
INSERT INTO User VALUES(5,'주영');
INSERT INTO User VALUES(6,'요한');

INSERT INTO board_info_table VALUES(1,'리그 오브 레전드','http://localhost:5000/images/board_img/League of Legends.png');
INSERT INTO board_info_table VALUES(2,'로스트 아크','http://localhost:5000/images/board_img/LOST ARK.png');
INSERT INTO board_info_table VALUES(3,'배틀 그라운드','http://localhost:5000/images/board_img/PUBG BATTLEGROUNDS.png');
INSERT INTO board_info_table VALUES(4,'발로란트','http://localhost:5000/images/board_img/VALORANT.png');
commit;
DELETE FROM board_info_table WHERE board_info_id=4;

INSERT INTO UserProfile VALUES(1,1,'체르','https://cdn.pixabay.com/photo/2013/05/30/18/21/cat-114782_1280.jpg','무엇을 해야 할까요?');
INSERT INTO UserProfile VALUES(2,2,'맹','https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg','자기소개');
INSERT INTO UserProfile VALUES(3,3,'김한결','https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg','자기소개1');
INSERT INTO UserProfile VALUES(4,4,'로크만','https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg','자기소개2');
INSERT INTO UserProfile VALUES(5,5,'기둥','https://cdn.pixabay.com/photo/2022/05/28/06/39/cat-7226671_1280.jpg','자기소개3');
INSERT INTO UserProfile VALUES(6,6,'요이커','https://cdn.pixabay.com/photo/2017/03/14/14/49/cat-2143332_1280.jpg','자기소개4');

DELETE FROM UserProfile WHERE profile_no=1;

INSERT INTO posts VALUES (NULL, 'This is a sample post 1', NULL, NULL, NULL, NULL, 1, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 2', NULL, NULL, NULL, NULL, 2, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 3', NULL, NULL, NULL, NULL, 3, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 4', NULL, NULL, NULL, NULL, 4, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 5', NULL, NULL, NULL, NULL, 5, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 6', NULL, NULL, NULL, NULL, 2, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 7', NULL, NULL, NULL, NULL, 1, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 8', NULL, NULL, NULL, NULL, 6, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 9', NULL, NULL, NULL, NULL, 6, NOW(), NULL, 1, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 10', NULL, NULL, NULL, NULL, 5, NOW(), NULL, 1, 0, 0, 0);
DELETE FROM posts WHERE post_id=10;
-- -----------------------------------------

INSERT INTO posts VALUES(null,'내용1','이미지1','이미지2','이미지3','이미지4',1,NOW(),null,1,0,0,0);
INSERT INTO posts VALUES(null,'내용2','이미지1',null,null,NULL,2,NOW(),null,1,0,0,0);
INSERT INTO posts VALUES(null,'내용3',NULL,NULL,NULL,NULL,3,NOW(),null,2,0,0,0);
INSERT INTO posts VALUES(null,'내용4','이미지1','이미지2','이미지3','이미지4',4,NOW(),null,3,0,0,0);

INSERT INTO comments VALUES(NULL,1,NULL,'댓글1',5,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,1,'대댓글1',2,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,2,'대댓글의 대댓글',5,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,NULL,'댓글2',4,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,4,'대댓글2-1',5,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,4,'대댓글2-2',1,NOW(),NULL,0,0);
INSERT INTO comments VALUES(NULL,1,6,'대댓들의 대댓글',5,NOW(),NULL,0,0);