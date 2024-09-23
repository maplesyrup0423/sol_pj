USE sol;

select * from user u 
join userprofile up on u.user_no=up.user_no;

select nickname, image_url, u.user_no, u.user_id from user u 
join userprofile up on u.user_no=up.user_no
where u.user_no=1;

SELECT p.post_id,p.post_text,p.user_no,p.createDate,p.modiDate, p.views,
GROUP_CONCAT(pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
u.user_id,up.nickname,up.image_url
FROM posts p
LEFT JOIN post_files pf ON p.post_id = pf.post_id
LEFT JOIN User u ON p.user_no = u.user_no
LEFT JOIN UserProfile up ON u.user_no = up.user_no
WHERE p.board_info_id = 1 and  p.isDeleted=0
GROUP BY p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url
ORDER BY p.createDate DESC;


SELECT p.post_id,p.post_text,p.user_no,p.createDate,p.modiDate, p.views,
GROUP_CONCAT( DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
u.user_id,up.nickname,up.image_url,
COUNT(DISTINCT l.p_like_id) AS like_count, 
COUNT(DISTINCT c.comment_id) AS comment_count 
FROM posts p
LEFT JOIN post_files pf ON p.post_id = pf.post_id
LEFT JOIN User u ON p.user_no = u.user_no
LEFT JOIN UserProfile up ON u.user_no = up.user_no
LEFT JOIN post_likes l ON p.post_id = l.post_id
LEFT JOIN comments c ON p.post_id = c.post_id 
WHERE p.board_info_id = 1 and  p.isDeleted=0
GROUP BY p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url
ORDER BY p.createDate DESC;

-- insert문 테스트 ( 프론트에서 입력받는 필요한 것만 )
INSERT INTO posts (post_text, user_no, board_info_id) VALUES ("인설트문 테스트", 1, 1);

select * from posts;
select * from post_files;

-- 유저별 선택 게시판
-- 추후 회원강비시 기본으로 몇개 등록하는 방법으로 구현
insert into userboard(user_no, board_info_id) value(1,1),(1,2),(1,3),(1,4);
insert into userboard(user_no, board_info_id) value(2,1),(2,2),(2,3);
insert into userboard(user_no, board_info_id) value(3,1),(3,2);
insert into userboard(user_no, board_info_id) value(4,1);
insert into userboard(user_no, board_info_id) value(5,1),(5,2);
insert into userboard(user_no, board_info_id) value(6,1),(6,2),(6,3);

select board_info_id from userboard where user_no=1;

select ub.board_info_id, bi.board_info_name, bi.board_img  
from userboard ub
LEFT JOIN board_info_table bi on bi.board_info_id=ub.board_info_id
 where ub.user_no=1;
 
 
 
 select c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	c.user_no, c.createDate, c.modiDate, c.isDeleted, count(cl.user_no) as like_count,
    u.nickname, u.image_url
from comments c
left join comment_likes cl
on c.comment_id = cl.comment_id
join UserProfile u
on u.user_no = c.user_no
WHERE c.post_id=16
group by c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	c.user_no, c.createDate, c.modiDate, c.isDeleted, u.nickname, u.image_url;
    
    select * from comments;
    select * from comments_files;
    
        select c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	  c.user_no, c.createDate, c.modiDate, c.isDeleted, count(cl.user_no) as like_count,
    u.nickname, u.image_url,
    GROUP_CONCAT(DISTINCT cf.comments_file_path ORDER BY cf.upload_date SEPARATOR ', ') AS file_paths
    from comments c
    left join comment_likes cl
    on c.comment_id = cl.comment_id
    join UserProfile u
    on u.user_no = c.user_no
    LEFT JOIN comments_files cf ON c.comment_id = cf.comment_id
    group by c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	  c.user_no, c.createDate, c.modiDate, c.isDeleted, u.nickname, u.image_url;
      
      
      select * from post_likes;
      
      
      INSERT INTO posts (post_text, user_no, board_info_id)
VALUES ('1번게시판 1번 게시글', 1, 1);
   select * from posts;
UPDATE posts
SET post_text = '수정합니다222',  views=123456789
WHERE post_id = 25;

DELETE FROM board_info_table
WHERE board_info_id = 5;

select board_img from board_info_table where board_info_id=1;

SELECT * FROM bookmarks WHERE post_id = 1 AND user_no = 1;
INSERT INTO bookmarks (post_id, user_no) VALUES (1, 1);
DELETE FROM bookmarks WHERE post_id = 1 AND user_no = 1;

SELECT * FROM bookmarks WHERE user_no = 1;


          SELECT u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
          u.user_id, up.nickname, up.image_url,
          GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
          COUNT(DISTINCT l.p_like_id) AS like_count,
          COUNT(DISTINCT c.comment_id) AS comment_count
          FROM posts p
          LEFT JOIN post_files pf ON p.post_id = pf.post_id
          LEFT JOIN User u ON p.user_no = u.user_no
            LEFT JOIN bookmarks bk on bk.user_no = u.user_no
          LEFT JOIN UserProfile up ON u.user_no = up.user_no
          LEFT JOIN post_likes l ON p.post_id = l.post_id
          LEFT JOIN comments c ON p.post_id = c.post_id
          GROUP BY u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url;
          
select  u.user_id, post_text, p.post_id, p.user_no
from User u
LEFT JOIN bookmarks bk on bk.user_no = u.user_no
LEFT JOIN posts p on p.post_id=bk.post_id
where bk.user_no=1;

SELECT u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, 
       u.user_id, up.nickname, up.image_url,p.board_info_id,
       GROUP_CONCAT(DISTINCT pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
       COUNT(DISTINCT l.p_like_id) AS like_count,
       COUNT(DISTINCT c.comment_id) AS comment_count
FROM posts p
LEFT JOIN post_files pf ON p.post_id = pf.post_id
LEFT JOIN User u ON p.user_no = u.user_no
LEFT JOIN bookmarks bk ON p.post_id = bk.post_id
LEFT JOIN UserProfile up ON u.user_no = up.user_no
LEFT JOIN post_likes l ON p.post_id = l.post_id
LEFT JOIN comments c ON p.post_id = c.post_id
WHERE bk.user_no = 1 AND p.isDeleted = 0
GROUP BY u.user_no, p.post_id, p.post_text, p.createDate, p.modiDate, p.views, u.user_id, up.nickname, up.image_url, p.board_info_id;


UPDATE posts SET isDeleted = 0 WHERE post_id = 22;

select * from comments;

select * from userfollower;

UPDATE comments SET isDeleted = 1 WHERE comment_id = 23;

select c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	  c.user_no, c.createDate, c.modiDate, c.isDeleted, count(cl.user_no) as like_count,
    u.nickname, u.image_url,
    GROUP_CONCAT(DISTINCT cf.comments_file_path ORDER BY cf.upload_date SEPARATOR ', ') AS file_paths
    from comments c
    left join comment_likes cl
    on c.comment_id = cl.comment_id
    join UserProfile u
    on u.user_no = c.user_no
    LEFT JOIN comments_files cf ON c.comment_id = cf.comment_id
    WHERE c.comment_id=22 AND c.isDeleted = 0
    group by c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
	  c.user_no, c.createDate, c.modiDate, c.isDeleted, u.nickname, u.image_url;
      
      
      select * from comments;
      
      
       select c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
   c.user_no, c.createDate, c.modiDate, c.isDeleted, count(cl.user_no) as like_count,
   u.nickname, u.image_url,
   GROUP_CONCAT(DISTINCT cf.comments_file_path ORDER BY cf.upload_date SEPARATOR ', ') AS file_paths
   from comments c
   left join comment_likes cl
   on c.comment_id = cl.comment_id
   join UserProfile u
   on u.user_no = c.user_no
  LEFT JOIN comments_files cf ON c.comment_id = cf.comment_id
   WHERE c.post_id=112 and c.isDeleted = 0
    AND c.parent_comment_id =34 GROUP BY c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
   c.user_no, c.createDate, c.modiDate, c.isDeleted, u.nickname, u.image_url;
   
   INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(114,41,'댓글의 답글의 답글의 답글',1);
   INSERT INTO comments(post_id,parent_comment_id,comment_text,user_no)
VALUES(114,41,'댓글의 답글의 답글의 답글',1);
   SELECT * FROM comments WHERE post_id = 114 AND (parent_comment_id = 39 OR parent_comment_id IN (SELECT comment_id FROM comments WHERE parent_comment_id = 39));
   
   WITH RECURSIVE CommentCTE AS (
    SELECT * FROM comments WHERE post_id = 114 AND parent_comment_id = 39
    UNION ALL
    SELECT c.* FROM comments c
    INNER JOIN CommentCTE cc ON c.parent_comment_id = cc.comment_id
)
SELECT * FROM CommentCTE;


-- 댓글과 해당 대댓글을 가져오는 쿼리
WITH RECURSIVE CommentCTE AS (

    SELECT c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
           c.user_no, c.createDate, c.modiDate, c.isDeleted,
           u.nickname, u.image_url
    FROM comments c
    JOIN UserProfile u ON u.user_no = c.user_no
    WHERE c.post_id = 114 AND c.isDeleted = 0 AND c.parent_comment_id = 39

    UNION ALL


    SELECT c.comment_id, c.post_id, c.parent_comment_id, c.comment_text,
           c.user_no, c.createDate, c.modiDate, c.isDeleted,
           u.nickname, u.image_url
    FROM comments c
    INNER JOIN CommentCTE cc ON c.parent_comment_id = cc.comment_id
    JOIN UserProfile u ON u.user_no = c.user_no
    WHERE c.isDeleted = 0
)

SELECT cc.comment_id, cc.post_id, cc.parent_comment_id, cc.comment_text,
       cc.user_no, cc.createDate, cc.modiDate, cc.isDeleted,
       cc.nickname, cc.image_url,
       COUNT(cl.user_no) AS like_count,
       GROUP_CONCAT(DISTINCT cf.comments_file_path ORDER BY cf.upload_date SEPARATOR ', ') AS file_paths
FROM CommentCTE cc
LEFT JOIN comment_likes cl ON cc.comment_id = cl.comment_id
LEFT JOIN comments_files cf ON cc.comment_id = cf.comment_id
GROUP BY cc.comment_id, cc.post_id, cc.parent_comment_id, cc.comment_text,
         cc.user_no, cc.createDate, cc.modiDate, cc.isDeleted, cc.nickname, cc.image_url
         ORDER BY cc.createDate DESC;

