import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../../../auth/api";
import "./ReportModal.css"; // CSS 파일 불러오기

function ReportModal({ postId, onClose, userInfo }) {
  const [reason, setReason] = useState("불법 콘텐츠");
  const [otherReason, setOtherReason] = useState("");

  const handleReportSubmit = async () => {
    try {
      await api.post("/api/report", {
        postId,
        reportReason: reason,
        otherReason: reason === "기타" ? otherReason : null,
        user_no: userInfo.user_no,
      });
      Swal.fire({
        title: "신고 완료",
        text: "신고가 성공적으로 접수되었습니다.",
        icon: "success",
        confirmButtonText: "확인",
      });
      onClose(); // 모달 닫기
    } catch (error) {
      Swal.fire({
        title: "신고 실패",
        text: "신고 접수 중 오류가 발생했습니다.",
        icon: "error",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <Modal show onHide={onClose} className="custom-modal">
      <Modal.Header closeButton>
        <Modal.Title>신고하기</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reportReason">
            <Form.Label>신고 사유</Form.Label>
            <Form.Control
              as="select"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option>불법 콘텐츠</option>
              <option>스팸</option>
              <option>모욕적 언어</option>
              <option>기타</option>
            </Form.Control>
          </Form.Group>
          {reason === "기타" && (
            <Form.Group controlId="otherReason">
              <Form.Label>기타 사유</Form.Label>
              <Form.Control
                type="text"
                placeholder="신고 사유를 입력하세요"
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleReportSubmit}>
          신고하기
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReportModal;
