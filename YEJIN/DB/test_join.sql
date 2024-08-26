USE sol;

select * from user u 
join userprofile up on u.user_no=up.user_no;

select nickname, image_url, u.user_no, u.user_id from user u 
join userprofile up on u.user_no=up.user_no
where u.user_no=1;

select * from user u 
join userprofile up on u.user_no=up.user_no
join posts p on p.user_no=u.user_no
where p.board_info_id=1;

select p.post_id, p.post_text, p.user_no, p.createDate,
p.modiDate, p.isDeleted, p.views, up.nickname, up.image_url, u.user_id from user u 
join userprofile up on u.user_no=up.user_no
join posts p on p.user_no=u.user_no
where p.board_info_id=1 and  p.isDeleted=0
ORDER BY p.createDate DESC;

select p.post_id, p.post_text, p.user_no, p.createDate,
p.modiDate, p.isDeleted, p.views, up.nickname, up.image_url, u.user_id from user u 
join userprofile up on u.user_no=up.user_no
join posts p on p.user_no=u.user_no
join post_files pf on pf.post_id = p.post_id
where p.board_info_id=1 and  p.isDeleted=0
ORDER BY p.createDate DESC;

SELECT 
    p.post_id, 
    p.post_text, 
    p.user_no, 
    p.createDate, 
    p.modiDate, 
    p.views, 
    pf.file_id, 
    pf.file_path, 
    pf.upload_date, 
    u.user_id, 
    up.nickname, 
    up.image_url
FROM 
    posts p
LEFT JOIN 
    post_files pf ON p.post_id = pf.post_id
LEFT JOIN 
    User u ON p.user_no = u.user_no
LEFT JOIN 
    UserProfile up ON u.user_no = up.user_no
WHERE 
    p.board_info_id = 1  and  p.isDeleted=0
ORDER BY 
    p.createDate DESC;

SELECT p.post_id,p.post_text,p.user_no,p.createDate,p.modiDate, p.views,pf.file_id,pf.file_path,pf.upload_date, 
    u.user_id,up.nickname,up.image_url
FROM  posts p
LEFT JOIN post_files pf ON p.post_id = pf.post_id
LEFT JOIN User u ON p.user_no = u.user_no
LEFT JOIN UserProfile up ON u.user_no = up.user_no
WHERE p.board_info_id = 1  and  p.isDeleted=0
ORDER BY p.createDate DESC;

SELECT 
    p.post_id, 
    p.post_text, 
    p.user_no, 
    p.createDate, 
    p.modiDate, 
    p.isDeleted, 
    p.views, 
    GROUP_CONCAT(pf.file_path ORDER BY pf.upload_date SEPARATOR ', ') AS file_paths,
    u.user_id, 
    up.nickname, 
    up.image_url
FROM 
    posts p
LEFT JOIN 
    post_files pf ON p.post_id = pf.post_id
LEFT JOIN 
    User u ON p.user_no = u.user_no
LEFT JOIN 
    UserProfile up ON u.user_no = up.user_no
WHERE 
    p.board_info_id = 1
GROUP BY 
    p.post_id, p.post_text, p.user_no, p.createDate, p.modiDate, p.isDeleted, p.views, u.user_id, up.nickname, up.image_url
ORDER BY 
    p.createDate DESC;



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
