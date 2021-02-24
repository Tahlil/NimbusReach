'reach 0.1';

const Funder =
      { sendFundMoney: Fun([], UInt),
        getPaymentMethod: Fun([], Bytes(64)) };

const VictimGroup =
 {
      victimArea: Bytes(64),
      numberOfFamilies: UInt,
      getTokens: Fun([UInt], Null)
 };

export const main =
  Reach.App(
    {},
    [['Org', Funder], ['VictimGrp', VictimGroup]],
    (org, victims) => {
      org.only(() => {
        const paymentMethod = declassify(interact.getPaymentMethod()); 
        const fundingAmount = declassify(interact.sendFundMoney());
      });

      org.publish(paymentMethod, fundingAmount)
       .pay(fundingAmount);
      commit();

      victims.only(() => {
        interact.getTokens(fundingAmount);
      });
      victims.publish();
    
      transfer(fundingAmount).to(victims);
      commit();

      exit(); 
    });