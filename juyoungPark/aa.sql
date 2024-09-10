USE sol;

-- 테이블 구조는 그대로 놔두고 안의 내용물만 삭제하고 싶을 경우 이 쿼리 사용--

SET FOREIGN_KEY_CHECKS = 0;

-- 모든 테이블의 데이터만 삭제하는 쿼리 생성
SELECT CONCAT('TRUNCATE TABLE `', user, '`;')
FROM information_schema.tables
WHERE table_schema = 'sol';

SET FOREIGN_KEY_CHECKS = 1;



select * from posts;
select * from user;
select * from board_info_table;
select * from UserBoard;


insert into board_info_table values (1, "이터널 리턴", "Eternal Return.png");
insert into board_info_table values (2, "리그 오브 레전드", "League of Legends.png");
insert into board_info_table values (3, "로스트 아크", "LOST ARK.png");
insert into board_info_table values (4, "배틀그라운드", "PUBG BATTLEGROUNDS.png");
insert into board_info_table values (5, "발로란트", "VALORANT.png");

insert into UserBoard values (5, 1);
insert into UserBoard values (5, 2);
insert into UserBoard values (5, 3);
insert into UserBoard values (5, 4);
insert into UserBoard values (5, 5);

insert into posts values (1, "졸령", 1, now(), null, 1, 0, 0);

commit;