import { UserSubscriptionModel } from "../../infra/databases/mongo/models/SubscriptionModel";

export async function runNightlySubscriptionCheck() {
    const now = new Date();
    
    // Find all expired subscriptions
    const expiredSubs = await UserSubscriptionModel.find({ 
        expiryDate: { $lt: now }, 
        status: 'active' 
    });

    for (const sub of expiredSubs) {
        
        if (sub.scheduledChange && sub.scheduledChange.status === 'pending_downgrade') {
             const nextCycle = sub.scheduledChange.billingCycle;
             const nextLevel = sub.scheduledChange.level;

             // Calculate new expiry
             const newExpiry = new Date(now);
             if (nextCycle === "Monthly") newExpiry.setMonth(now.getMonth() + 1);
             else newExpiry.setFullYear(now.getFullYear() + 1);

             await UserSubscriptionModel.updateOne({ _id: sub._id }, {
                 level: nextLevel,
                 billingCycle: nextCycle,
                 expiryDate: newExpiry,
                 scheduledChange: null
             });
             continue;
        }

        if (sub.reservedPlan && sub.reservedPlan.daysRemaining > 0) {
             const newExpiry = new Date(now);
             newExpiry.setDate(now.getDate() + sub.reservedPlan.daysRemaining);

             await UserSubscriptionModel.updateOne({ _id: sub._id }, {
                 level: sub.reservedPlan.level,
                 expiryDate: newExpiry,
                 reservedPlan: null
             });
             continue;
        }

        // PRIORITY 3: Just Expire
        await UserSubscriptionModel.updateOne({ _id: sub._id }, {
             status: 'expired',
             level: 'Free'
        });
    }
}
