

//https://hardhat.org/advanced/building-plugins.html 

task("make_donations", "Become a donor and make donations")
  .addParam("money", "Money for donations")
  .setAction(async (taskArgs, hre) => {

    await hre.hardhatToken.setDonor({value: ethers.utils.parseEther(taskArgs.money)});
    console.log("You send ", taskArgs.money, "You are donor! Thank you!");
  });

task("get_all_addresses", "Get all addresses that have made transfers")
  .setAction(async (taskArguments, hre) => {
   
    const listAddress = await hre.hardhatToken.getAllDonorsAddress();
    console.log("Addresses from which the money came: ",listAddress);
  });

  task("get_amount_donor_money", "The full amount of the amount was transferred from the address")
  .addParam("address", "The address from which funds were received")
  .setAction(async (taskArgs, hre) => {
    
    const amount = await hre.hardhatToken.getAmountDonorMoney(taskArgs.address);

    console.log("Full amount from ", taskArgs.address , " :", amount);
  });

  task("transfer_to", "Withdraw money to a specific address")
  .addParam("address", "The address where the money will be withdrawn")
  .addParam("money", "The amount to be withdrawn")
  .setAction(async (taskArgs, hre) => {
   
    await hre.hardhatToken.transferTo(taskArgs.address,taskArgs.amount);

    console.log("The ",taskArgs.money,"was transferred to ",taskArgs.address);
  });
module.exports = {};
