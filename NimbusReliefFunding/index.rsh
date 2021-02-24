'reach 0.1';

const Funder =
      { sendFundMoney: Fun([], UInt),
        getPaymentMethod: Fun([], Bytes(64)) };

const VictimGroup =
 {
      getToken: Fun([Bytes(64)], Null)
 };
//, ["VictimGrp", VictimGroup]
export const main =
  Reach.App(
    {},
    [['Org', Funder]],
    (org) => {
      org.only(() => {
        const paymentMethod = declassify(interact.getPaymentMethod()); 
        const fundingAmount = declassify(interact.sendFundMoney());
      });
      org.publish(paymentMethod);
      commit();
      org.publish(fundingAmount);
      commit();
     
      exit(); 
    });