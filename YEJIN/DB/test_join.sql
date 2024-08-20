USE sol;

select * from user u 
join userprofile up on u.user_no=up.user_no;

select nickname, image_url, u.user_no, u.user_id from user u 
join userprofile up on u.user_no=up.user_no
where u.user_no=1;