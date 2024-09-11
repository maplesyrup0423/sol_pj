USE sol;

-- 유저 _no값이 자동으로 증가되도록 바꿨음 이제 no값은 insert문에 넣지 않아도 됨. --
INSERT INTO User (user_id, status) VALUES('Maple2423', NULL);
INSERT INTO User (user_id, status) VALUES('xxzz9978', NULL);
INSERT INTO User (user_id, status) VALUES('gksruf1414', NULL);
INSERT INTO User (user_id, status) VALUES('Uhan', NULL);
INSERT INTO User (user_id, status) VALUES('JYP', NULL);
INSERT INTO User (user_id, status) VALUES('LIMJ2022', NULL);


-- 유저 프로필 여기도 마찬가지
INSERT INTO UserProfile (user_no, nickname, image_url, introduce) VALUES(1, '체르', 'testImg4.jpg', '무엇을 해야 할까요?');
INSERT INTO UserProfile (user_no, nickname, image_url, introduce) VALUES(2, '맹', 'testImg3.jpg', '자기소개');
INSERT INTO UserProfile (user_no, nickname, image_url, introduce) VALUES(3, '김한결', 'testImg1.png', '자기소개1');
INSERT INTO UserProfile (user_no, nickname, image_url, introduce) VALUES(4, '로크만', 'testImg2.jpg', '자기소개2');
INSERT INTO UserProfile (user_no, nickname, image_url, introduce) VALUES(5, '기둥', 'testImg5.jpg', '자기소개3');
INSERT INTO UserProfile (user_no, nickname, image_url, introduce) VALUES(6, '요이커', 'testImg6.jpg', '자기소개4');

select * from userprofile;
update UserProfile set nickname = '체르', introduce ='무엇을 해야 할까요?', image_url='testImg4.jpg'
where user_no = 1;

update UserProfile set nickname = '김한결', introduce ='자기소개1', image_url='testImg1.png'
where user_no = 3;

commit;

-- 유저 패스워드 (회원 비밀번호 1234로 통일해놓은 상태)
INSERT INTO password (user_no, salt, password, update_date) VALUES(1, '10', '1234', NOW());
INSERT INTO password (user_no, salt, password, update_date) VALUES(2, '10', '1234', NOW());
INSERT INTO password (user_no, salt, password, update_date) VALUES(3, '10', '1234', NOW());
INSERT INTO password (user_no, salt, password, update_date) VALUES(4, '10', '1234', NOW());
INSERT INTO password (user_no, salt, password, update_date) VALUES(5, '10', '1234', NOW());
INSERT INTO password (user_no, salt, password, update_date) VALUES(6, '10', '1234', NOW());

-- 친구 추가
INSERT INTO userfollower (follower_no, following_no) VALUES(6,1);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,2);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,3);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,4);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,5);
INSERT INTO userfollower (follower_no, following_no) VALUES(6,6);
INSERT INTO userfollower (follower_no, following_no) VALUES(1,2);
INSERT INTO userfollower (follower_no, following_no) VALUES(1,3);
INSERT INTO userfollower (follower_no, following_no) VALUES(1,4);
INSERT INTO userfollower (follower_no, following_no) VALUES(1,5);
INSERT INTO userfollower (follower_no, following_no) VALUES(1,6);

-- 회원가입 테스트 --
CALL RegisterUser(
    'amino014',          -- user_id (사용자 ID)
    '임재A',         -- nickname (닉네임)
    '',  -- image_url (프로필 이미지)
    '안녕하세요 잘부탁드립니다.', -- introduce (자기 소개)
    1,                  -- gender (성별: 1 = 남성, 2 = 여성 등)
    '010-3920-7972',    -- phone (전화번호)
    'heuristic2022@gmail.com', -- email (이메일)
    '1994-05-01',       -- birthdate (생년월일)
    'Seoul, South Korea', -- address (주소)
    '1234',  -- password (해시된 비밀번호)
    'salt01' -- salt (비밀번호에 사용된 솔트)
);
