import { Router } from "express";
import { container } from "tsyringe";
import { expressAdapter } from "../../adaptors/ExpressAdaptor.js";
import { WalletController } from "../../http/controllers/shared/WalletController.js";


const router = Router();

const walletController = container.resolve(WalletController)

router.get("/:userId/methods", expressAdapter(walletController.getPayoutMethods));
router.post("/:userId/save", expressAdapter(walletController.savePayoutMethod));
router.delete("/:userId/remove", expressAdapter(walletController.deletePayoutMethod));

router.post("/:userId/add-money", expressAdapter(walletController.createDepositOrder));
router.post("/:userId/verify", expressAdapter(walletController.verifyDeposit));
router.post("/:userId/withdraw", expressAdapter(walletController.withdraw));
router.post("/webhooks/razorpay", expressAdapter(walletController.handleRazorpayWebhook));


export default router;