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

-- 댓글 등록 쿼리
insert into comments values(1, 1, null, '댓글 입니다', 1, '2024-09-09', null, 0);
select * from comments;


-- 댓글 가져오는 쿼리
select c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	c.user_no, c.createDate, c.modiDate, c.isDeleted, count(cl.user_no) as like_count,
    u.nickname, u.image_url
from comments c
left join comment_likes cl
on c.comment_id = cl.comment_id
join UserProfile u
on u.user_no = c.user_no
where c.post_id = 6 AND c.parent_comment_id = 3
group by c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	c.user_no, c.createDate, c.modiDate, c.isDeleted, u.nickname, u.image_url;
    
select up.nickname, u.user_id
from comments c
join UserProfile up
on up.user_no = c.user_no
join User u
on up.user_no = u.user_no
where c.post_id = 7 and c.comment_id = 10;



-- 좋아요 수
select count(cl.user_no) from comment_likes cl
join comments c
on cl.comment_id = c.comment_id;

          SELECT u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
          u.user_id, up.nickname, up.image_url,
          GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
          COUNT(DISTINCT l.p_like_id) AS like_count,
          COUNT(DISTINCT c.comment_id) AS comment_count
          FROM posts p
          LEFT JOIN post_files pf ON p.post_id = pf.post_id
          LEFT JOIN User u ON p.user_no = u.user_no
          LEFT JOIN UserProfile up ON u.user_no = up.user_no
          LEFT JOIN post_likes l ON p.post_id = l.post_id
          LEFT JOIN comments c ON p.post_id = c.post_id
          WHERE p.post_id = 6 AND p.isDeleted = 0
          GROUP BY u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url;

use sol;
WITH RECURSIVE CommentCTE AS (
    SELECT c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
           c.user_no, c.createDate, c.modiDate, c.isDeleted,
           u.nickname, u.image_url, u_main.user_id AS user_id, u2.user_id AS parent_user_id
    FROM comments c
    JOIN UserProfile u ON u.user_no = c.user_no
    JOIN User u_main ON c.user_no = u_main.user_no -- 댓글 작성자의 user_id 가져오기
    LEFT JOIN comments c2 ON c.parent_comment_id = c2.comment_id
    LEFT JOIN User u2 ON c2.user_no = u2.user_no -- 부모 댓글 작성자의 user_id 가져오기
    WHERE c.post_id = 7 AND c.isDeleted = 0 AND c.parent_comment_id IS NULL

    UNION ALL

    SELECT c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
           c.user_no, c.createDate, c.modiDate, c.isDeleted,
           u.nickname, u.image_url, u_main.user_id AS user_id, u2.user_id AS parent_user_id
    FROM comments c
    INNER JOIN CommentCTE cc ON c.parent_comment_id = cc.comment_id
    JOIN UserProfile u ON u.user_no = c.user_no
    JOIN User u_main ON c.user_no = u_main.user_no -- 댓글 작성자의 user_id 가져오기
    LEFT JOIN comments c2 ON c.parent_comment_id = c2.comment_id
    LEFT JOIN User u2 ON c2.user_no = u2.user_no -- 부모 댓글 작성자의 user_id 가져오기
    WHERE c.isDeleted = 0
)

-- 메인 쿼리: 부모 댓글 및 대댓글과 좋아요 수, 파일 첨부 정보 가져오기
SELECT cc.comment_id, cc.post_id, cc.parent_comment_id, cc.comment_text,
       cc.user_no, cc.createDate, cc.modiDate, cc.isDeleted,
       cc.nickname, cc.image_url, cc.user_id, cc.parent_user_id,
       COUNT(cl.user_no) AS like_count,
       GROUP_CONCAT(DISTINCT cf.comments_file_path ORDER BY cf.upload_date SEPARATOR ', ') AS file_paths,
       -- 대댓글 수 계산 (parent_comment_id가 null이 아닌 댓글)
       (SELECT COUNT(*) FROM CommentCTE ccte WHERE ccte.parent_comment_id = cc.comment_id) AS reply_count
FROM CommentCTE cc
LEFT JOIN comment_likes cl ON cc.comment_id = cl.comment_id
LEFT JOIN comments_files cf ON cc.comment_id = cf.comment_id
GROUP BY cc.comment_id, cc.post_id, cc.parent_comment_id, cc.comment_text,
         cc.user_no, cc.createDate, cc.modiDate, cc.isDeleted, cc.nickname, cc.image_url, cc.user_id, cc.parent_user_id
ORDER BY cc.createDate ASC;

select * from comments;


use sol;

SELECT p.board_info_id, p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views,
          GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
          u.user_id, up.nickname, up.image_url,
          COUNT(DISTINCT l.p_like_id) AS like_count,
          COUNT(DISTINCT c.comment_id) AS comment_count, up.introduce
          FROM posts p
          LEFT JOIN post_files pf ON p.post_id = pf.post_id
          LEFT JOIN User u ON p.user_no = u.user_no
          LEFT JOIN UserProfile up ON u.user_no = up.user_no
          LEFT JOIN post_likes l ON p.post_id = l.post_id
          LEFT JOIN comments c ON p.post_id = c.post_id
          WHERE p.board_info_id = 1 AND p.isDeleted = 0 AND p.post_text LIKE '%ㅇㅇ%'
          GROUP BY p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url;
















commit;