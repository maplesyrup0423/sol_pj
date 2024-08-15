-- posts 테이블에 대한 트리거를 만들어 업데이트 전 데이터를 백업합니다.
CREATE TRIGGER before_posts_update
BEFORE UPDATE ON posts
FOR EACH ROW
BEGIN
    INSERT INTO posts_backup (
        original_post_id, post_text, post_file1, post_file2, post_file3, post_file4, 
        user_no, createDate, modiDate, board_info_id, isDeleted, views, likes_count
    )
    VALUES (
        OLD.post_id, OLD.post_text, OLD.post_file1, OLD.post_file2, OLD.post_file3, OLD.post_file4, 
        OLD.user_no, OLD.createDate, OLD.modiDate, OLD.board_info_id, OLD.isDeleted, OLD.views, OLD.likes_count
    );
END;

--comments 테이블에 대한 트리거를 만들어 업데이트 전 데이터를 백업합니다.
CREATE TRIGGER before_comments_update
BEFORE UPDATE ON comments
FOR EACH ROW
BEGIN
    INSERT INTO comments_backup (
        original_comment_id, post_id, parent_comment_id, comment_text, 
        user_no, createDate, modiDate, isDeleted, likes_count
    )
    VALUES (
        OLD.comment_id, OLD.post_id, OLD.parent_comment_id, OLD.comment_text, 
        OLD.user_no, OLD.createDate, OLD.modiDate, OLD.isDeleted, OLD.likes_count
    );
END;