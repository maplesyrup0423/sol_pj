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
ORDER BY p.createDate DESC