USE sol;
-- 유저
INSERT INTO User VALUES(1,'예진');
INSERT INTO User VALUES(2,'일진');
INSERT INTO User VALUES(3,'한결');
INSERT INTO User VALUES(4,'유한');
INSERT INTO User VALUES(5,'주영');
INSERT INTO User VALUES(6,'요한');

-- 유저 프로필
INSERT INTO UserProfile VALUES(1,1,'체르','https://cdn.pixabay.com/photo/2013/05/30/18/21/cat-114782_1280.jpg','무엇을 해야 할까요?');
INSERT INTO UserProfile VALUES(2,2,'맹','https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg','자기소개');
INSERT INTO UserProfile VALUES(3,3,'김한결','https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg','자기소개1');
INSERT INTO UserProfile VALUES(4,4,'로크만','https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg','자기소개2');
INSERT INTO UserProfile VALUES(5,5,'기둥','https://cdn.pixabay.com/photo/2022/05/28/06/39/cat-7226671_1280.jpg','자기소개3');
INSERT INTO UserProfile VALUES(6,6,'요이커','https://cdn.pixabay.com/photo/2017/03/14/14/49/cat-2143332_1280.jpg','자기소개4');

-- 게시판
INSERT INTO board_info_table VALUES(1,'리그 오브 레전드','http://localhost:5000/images/board_img/League of Legends.png');
INSERT INTO board_info_table VALUES(2,'로스트 아크','http://localhost:5000/images/board_img/LOST ARK.png');
INSERT INTO board_info_table VALUES(3,'배틀 그라운드','http://localhost:5000/images/board_img/PUBG BATTLEGROUNDS.png');
INSERT INTO board_info_table VALUES(4,'발로란트','http://localhost:5000/images/board_img/VALORANT.png');

-- 게시글 (사진 X)
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
INSERT INTO posts VALUES (NULL, 'This is a sample post 11', NULL, NULL, NULL, NULL, 1, NOW(), NULL, 2, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 12', NULL, NULL, NULL, NULL, 2, NOW(), NULL, 2, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 13', NULL, NULL, NULL, NULL, 3, NOW(), NULL, 2, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 14', NULL, NULL, NULL, NULL, 4, NOW(), NULL, 2, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 15', NULL, NULL, NULL, NULL, 5, NOW(), NULL, 2, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 16', NULL, NULL, NULL, NULL, 2, NOW(), NULL, 3, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 17', NULL, NULL, NULL, NULL, 1, NOW(), NULL, 3, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 18', NULL, NULL, NULL, NULL, 6, NOW(), NULL, 3, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 19', NULL, NULL, NULL, NULL, 6, NOW(), NULL, 3, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 20', NULL, NULL, NULL, NULL, 5, NOW(), NULL, 3, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 21', NULL, NULL, NULL, NULL, 2, NOW(), NULL, 4, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 22', NULL, NULL, NULL, NULL, 1, NOW(), NULL, 4, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 23', NULL, NULL, NULL, NULL, 6, NOW(), NULL, 4, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 24', NULL, NULL, NULL, NULL, 6, NOW(), NULL, 4, 0, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 25', NULL, NULL, NULL, NULL, 5, NOW(), NULL, 4, 0, 0, 0);