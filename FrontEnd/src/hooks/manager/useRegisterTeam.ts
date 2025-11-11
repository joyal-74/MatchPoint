import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { Tournament } from "../../features/manager/managerTypes";
import { useAppDispatch, useAppSelector } from "../hooks";
import { paymentInitiate, verifyTournamentPayment } from "../../features/manager/Tournaments/tournamentThunks";


export type PaymentMethod = "razorpay" | "wallet";

export function useRegisterTeam(
    entryFee: number,
    tournament: Tournament,
    managerId: string,
    onClose: () => void
) {
    const [selectedTeam, setSelectedTeam] = useState<string>("");
    const [selectedCaptain, setSelectedCaptain] = useState<string>("");
    const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("razorpay");
    const [agree, setAgree] = useState(false);
    const { loading, error } = useAppSelector((s) => s.managerTournaments);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    async function loadRazorpayScript() {
        return new Promise<void>((resolve, reject) => {
            if (window.Razorpay) return resolve();
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve();
            script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
            document.body.appendChild(script);
        });
    }

    async function handlePayment() {
        if (!selectedTeam || !selectedCaptain || !agree) return;

        if (selectedPayment === "razorpay") await loadRazorpayScript();

        const result = await dispatch(
            paymentInitiate({
                tournamentId: tournament._id,
                teamId: selectedTeam,
                captainId: selectedCaptain,
                managerId,
                paymentMethod: selectedPayment,
            })
        ).unwrap();

        if (selectedPayment === "razorpay" && result.orderId) {
            const options = {
                key: result.keyId,
                amount: entryFee * 100,
                currency: "INR",
                order_id: result.orderId,
                handler: async (response: { razorpay_payment_id: string }) => {
                    await dispatch(
                        verifyTournamentPayment({
                            registrationId: result.registrationId,
                            paymentId: response.razorpay_payment_id,
                            paymentStatus: "completed",
                        })
                    ).unwrap();
                    navigate(`/manager/tournaments/${tournament._id}/${selectedTeam}/payment-success`);
                    onClose();
                },
                prefill: { name: selectedTeam },
                theme: { color: "#3399cc" },
            };
            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", () => {
                navigate(`/manager/tournaments/${tournament._id}/${selectedTeam}/payment-failed`);
            });
            rzp.open();
        } else if (selectedPayment === "wallet") {
            await dispatch(
                verifyTournamentPayment({
                    registrationId: result.registrationId,
                    paymentId: result.paymentSessionId,
                    paymentStatus: "completed",
                })
            ).unwrap();
            toast.success("Payment deducted from wallet!");
            onClose();
        }
    }

    return {
        loading,
        selectedTeam,
        selectedCaptain,
        selectedPayment,
        agree,
        setSelectedTeam,
        setSelectedCaptain,
        setSelectedPayment,
        setAgree,
        handlePayment,
    };
}