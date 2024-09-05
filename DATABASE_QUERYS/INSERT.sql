USE sol;
-- 유저
INSERT INTO User VALUES(1,'Maple2423');
INSERT INTO User VALUES(2,'xxzz9978');
INSERT INTO User VALUES(3,'gksruf1414');
INSERT INTO User VALUES(4,'Uhan');
INSERT INTO User VALUES(5,'JYP');
INSERT INTO User VALUES(6,'LIMJ2022');


-- 유저 프로필
INSERT INTO UserProfile VALUES(1,1,'체르','https://cdn.pixabay.com/photo/2013/05/30/18/21/cat-114782_1280.jpg','무엇을 해야 할까요?');
INSERT INTO UserProfile VALUES(2,2,'맹','https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg','자기소개');
INSERT INTO UserProfile VALUES(3,3,'김한결','https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg','자기소개1');
INSERT INTO UserProfile VALUES(4,4,'로크만','https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg','자기소개2');
INSERT INTO UserProfile VALUES(5,5,'기둥','https://cdn.pixabay.com/photo/2022/05/28/06/39/cat-7226671_1280.jpg','자기소개3');
INSERT INTO UserProfile VALUES(6,6,'요이커','https://cdn.pixabay.com/photo/2017/03/14/14/49/cat-2143332_1280.jpg','자기소개4');

select * from UserProfile;
update UserProfile set nickname = '김한결', introduce ='123123'
where user_no = 3;

-- 게시판
INSERT INTO board_info_table VALUES(1,'리그 오브 레전드','League of Legends.png');
INSERT INTO board_info_table VALUES(2,'로스트 아크','LOST ARK.png');
INSERT INTO board_info_table VALUES(3,'배틀 그라운드','PUBG BATTLEGROUNDS.png');
INSERT INTO board_info_table VALUES(4,'발로란트','VALORANT.png');

-- 게시글
INSERT INTO posts VALUES (NULL, 'This is a sample post 1', 1, NOW(), NULL, 1, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 2', 2, NOW(), NULL, 2, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 3', 3, NOW(), NULL, 3, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 4', 4, NOW(), NULL, 4, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 5', 5, NOW(), NULL, 1, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 6', 6, NOW(), NULL, 2, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 7', 1, NOW(), NULL, 3, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 8', 2, NOW(), NULL, 4, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 9', 3, NOW(), NULL, 1, 0, 0);
INSERT INTO posts VALUES (NULL, 'This is a sample post 10', 4, NOW(), NULL, 2, 0, 0);
INSERT INTO posts VALUES (NULL, 'img test post', 1, NOW(), NULL, 1, 0, 0);
INSERT INTO posts VALUES (NULL, 'img test post2', 1, NOW(), NULL, 1, 0, 0);


-- 게시글 사진
INSERT INTO post_files VALUES (NULL, 1,'https://cdn.pixabay.com/photo/2020/11/26/11/48/cat-5778777_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 9,'https://cdn.pixabay.com/photo/2019/08/20/21/21/cat-4419763_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 9,'https://cdn.pixabay.com/photo/2018/09/15/08/14/cat-3678858_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 11,'https://cdn.pixabay.com/photo/2023/12/28/14/09/cat-8474233_1280.png',NOW());
INSERT INTO post_files VALUES (NULL, 11,'https://cdn.pixabay.com/photo/2021/10/27/19/09/cat-6748193_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 11,'https://cdn.pixabay.com/photo/2022/12/05/05/20/cat-7635983_1280.png',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2021/11/05/19/30/animal-6771900_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/05/27/22/56/kitten-8022452_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/12/07/19/45/tiger-8436227_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/11/02/00/19/ai-generated-8359510_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/07/04/08/31/cats-8105667_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/10/15/16/06/the-cat-8317334_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/09/07/22/58/cat-8240012_960_720.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/08/26/12/28/tiger-8214815_960_720.png',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/07/19/22/28/amur-tiger-8138017_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/09/18/13/51/cat-8260638_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/07/13/07/00/cat-8124039_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2023/06/29/12/22/snow-leopard-8096293_1280.png',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2017/02/15/12/12/cat-2068462_1280.jpg',NOW());
INSERT INTO post_files VALUES (NULL, 12,'https://cdn.pixabay.com/photo/2018/07/13/10/20/kittens-3535404_960_720.jpg',NOW());

-- 유저 패스워드 (회원 비밀번호 1234로 통일해놓은 상태)
INSERT INTO password values(1,1,10,1234,now());
INSERT INTO password values(2,2,10,1234,now());
INSERT INTO password values(3,3,10,1234,now());
INSERT INTO password values(4,4,10,1234,now());
INSERT INTO password values(5,5,10,1234,now());
INSERT INTO password values(6,6,10,1234,now());

-- 좋아요
INSERT INTO post_likes VALUES(NULL, 11,2, NOW());
INSERT INTO post_likes VALUES(NULL, 11,3, NOW());
INSERT INTO post_likes VALUES(NULL, 11,4, NOW());
INSERT INTO post_likes VALUES(NULL, 11,5, NOW());
INSERT INTO post_likes VALUES(NULL, 11,6, NOW());
INSERT INTO post_likes VALUES(NULL, 9,1, NOW());
INSERT INTO post_likes VALUES(NULL, 9,2, NOW());

-- 댓글
INSERT INTO comments VALUES(NULL,11,NULL,'댓글1',5,NOW(),NULL,0);
INSERT INTO comments VALUES(NULL,11,1,'1-1',2,NOW(),NULL,0);
INSERT INTO comments VALUES(NULL,11,2,'1-1-1',5,NOW(),NULL,0);
INSERT INTO comments VALUES(NULL,11,NULL,'댓글2',4,NOW(),NULL,0);
INSERT INTO comments VALUES(NULL,11,4,'2-1',5,NOW(),NULL,0);
INSERT INTO comments VALUES(NULL,11,4,'2-2',1,NOW(),NULL,0);
INSERT INTO comments VALUES(NULL,11,6,'2-2-1',5,NOW(),NULL,0);

-- 친구 추가
INSERT INTO userfollower (follower_no, following_no) VALUES(6,1);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,2);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,3);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,4);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,5);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,6);