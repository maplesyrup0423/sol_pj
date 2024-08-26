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

select p.post_id, p.post_text, p.post_file1, p.post_file2, p.post_file3, p.post_file4, p.user_no, p.createDate,
p.modiDate, p.isDeleted, p.views, p.likes_count, up.nickname, up.image_url, u.user_id from user u 
join userprofile up on u.user_no=up.user_no
join posts p on p.user_no=u.user_no
where p.board_info_id=1
ORDER BY post_id DESC;