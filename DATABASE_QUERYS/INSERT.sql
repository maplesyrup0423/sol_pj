USE sol;
-- 유저
INSERT INTO User VALUES(1,'Maple2423');
INSERT INTO User VALUES(2,'xxzz9978');
INSERT INTO User VALUES(3,'gksruf1414');
INSERT INTO User VALUES(4,'Uhan');
INSERT INTO User VALUES(5,'JYP');
INSERT INTO User VALUES(6,'LIMJ2022');


-- 유저 프로필
-- 사진 부분에는"파일명.확장자"로 통일 || 현재는 하드코딩
INSERT INTO UserProfile VALUES(1,1,'체르','https://cdn.pixabay.com/photo/2013/05/30/18/21/cat-114782_1280.jpg','무엇을 해야 할까요?');
INSERT INTO UserProfile VALUES(2,2,'맹','https://cdn.pixabay.com/photo/2014/03/29/09/17/cat-300572_1280.jpg','자기소개');
INSERT INTO UserProfile VALUES(3,3,'김한결','https://cdn.pixabay.com/photo/2014/11/30/14/11/cat-551554_1280.jpg','자기소개1');
INSERT INTO UserProfile VALUES(4,4,'로크만','https://cdn.pixabay.com/photo/2024/02/28/07/42/european-shorthair-8601492_1280.jpg','자기소개2');
INSERT INTO UserProfile VALUES(5,5,'기둥','https://cdn.pixabay.com/photo/2022/05/28/06/39/cat-7226671_1280.jpg','자기소개3');
INSERT INTO UserProfile VALUES(6,6,'요이커','https://cdn.pixabay.com/photo/2017/03/14/14/49/cat-2143332_1280.jpg','자기소개4');

select * from UserProfile;
update UserProfile set nickname = '김한결', introduce ='123123'
where user_no = 3;

-- 유저 패스워드 (회원 비밀번호 1234로 통일해놓은 상태)
INSERT INTO password values(1,1,10,1234,now());
INSERT INTO password values(2,2,10,1234,now());
INSERT INTO password values(3,3,10,1234,now());
INSERT INTO password values(4,4,10,1234,now());
INSERT INTO password values(5,5,10,1234,now());
INSERT INTO password values(6,6,10,1234,now());

-- 친구 추가
INSERT INTO userfollower (follower_no, following_no) VALUES(6,1);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,2);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,3);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,4);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,5);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,6);