import React from "react";
import { useParams } from "react-router-dom";
import Modal from "../components/Modal";
import InfoSheet, { INFO_SHEETS } from "./InfoSheet";

export default function SheetModal() {
    const { slug } = useParams();
    const title = INFO_SHEETS[slug]?.title || "Info";
    return (
        <Modal title={title}>
            <InfoSheet />
        </Modal>
    );
}
