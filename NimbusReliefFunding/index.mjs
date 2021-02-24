import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const startingOrgBalance = stdlib.parseCurrency(20000);
  const startingVictimGroupBalance = stdlib.parseCurrency(1);

  const accOrg = await stdlib.newTestAccount(startingOrgBalance);
  const accVictimGrp = await stdlib.newTestAccount(startingVictimGroupBalance);

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
  const beforeFunderBalance = await getBalance(accOrg);
  const beforeVictimGroup = await getBalance(accVictimGrp);

  const ctcOrg = accOrg.deploy(backend);
  const ctcVictimGrp = accOrg.attach(backend, ctcOrg.getInfo());
  const txes = {name: "Org X"};
  txes["victimArea"] = "Hatibandha, Mymensing";
  txes["numberOfFamilies"] = 11;

  const Funder = (Who) => ({
    getPaymentMethod: () => {
      txes["paymentmedhod"] = "Nogod"
      
      console.log(`${Who} pays with ${txes["paymentmedhod"]}`);
      return txes["paymentmedhod"];
    },
    sendFundMoney: () => {
      txes["fundAmount"] = Number(beforeFunderBalance) / 2; 
      console.log(`${Who} funded amount of ${txes["fundAmount"]}`);
      return txes["fundAmount"];
    },
  });

  await Promise.all([
    backend.Org(
      ctcOrg,
      Funder('Org'),
    ),
    backend.VictimGrp(ctcVictimGrp, {
        getTokens: (amt) => {
          console.log(`Victims group accepts the wager of ${fmt(amt)}.`);
        },
      }),
  ]);

  const afterFunderBalance = await getBalance(accOrg) - txes["fundAmount"]
  console.log(`Funder balance went from ${beforeFunderBalance} to ${afterFunderBalance}.`);
  console.log(`Victimgroups at ${txes["victimArea"]} got ${txes["fundAmount"]}.`);
  txes["FunderBalance"] = afterFunderBalance;
  console.log("smart contract transaction: ");
  console.log(txes);
})();