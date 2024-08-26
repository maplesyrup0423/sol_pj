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

