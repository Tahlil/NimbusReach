import { loadStdlib } from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';

(async () => {
  const stdlib = await loadStdlib();
  const startingOrgBalance = stdlib.parseCurrency(10000);
  // const startingVictimGroupBalance = stdlib.parseCurrency(10);

  const accOrg = await stdlib.newTestAccount(startingOrgBalance);
  const accVictimGrp = await stdlib.newTestAccount(startingVictimGroupBalance);

  const fmt = (x) => stdlib.formatCurrency(x, 4);
  const getBalance = async (who) => fmt(await stdlib.balanceOf(who));
  const beforeFunderBalance = await getBalance(accOrg);
  const beforeVictimGroup = await getBalance(accBob);

  const ctcOrg = accOrg.deploy(backend);
  const ctcVictimGrp = accOrg.attach(backend, ctcAlice.getInfo());
  const txes = {name: "Org X"}

  const Funder = (Who) => ({
    getPaymentMethod: () => {
      txes["paymentmedhod"] = "Nogod"
      
      console.log(`${Who} pays with  ${txes["paymentmedhod"]}`);
      return txes["paymentmedhod"];
    },
    sendFundMoney: () => {
      txes["fundAmount"] = Number(beforeFunderBalance) / 4; 
      console.log(`${Who} saw outcome ${txes["fundAmount"]}`);
      return txes["fundAmount"];
    },
  });

  await Promise.all([
    backend.Org(
      ctcOrg,
      Funder('Org'),
    ),
  
  ]);

  console.log("smart contract transaction: ");
  console.log(txes);
})();