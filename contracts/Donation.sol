
pragma solidity >=0.4.0 <0.9.0;

contract Donation {
    address  owner;
    address public donorAddress;
    
    event TransferSent(address from, address to, uint amount);

    mapping(address => uint[])  donors;
    address[] addressDonors;

    constructor(){
        owner = msg.sender;
        donorAddress = address(this);
    }
    
    function setDonor() public payable  {
        require(msg.value >= 1 wei,  "The donation needs to be >1 wei in order for it to go through");
        donors[msg.sender].push(msg.value);
        for(uint i = 0; i < addressDonors.length; ++i){
            if (addressDonors[i] == msg.sender){
                return;
            }
        }
        addressDonors.push(msg.sender);
    }

    function getAllDonorsAddress() public view returns(address[] memory) {
        return(addressDonors);
    }

    function getAmountDonorMoney(address donorAddres) public  view  returns(uint){
        uint amount = 0;
        for (uint i = 0; i < donors[donorAddres].length; i++){
            amount += donors[donorAddres][i];
        }
        return amount;
    }
    //get all the amounts transferred by the address
    function getDonorMoney(address donorAddres) public  view  returns(uint[] memory){
        return donors[donorAddres];
    }
   
    function transferTo(address transferAddress, uint amount) public payable{
        require(donorAddress.balance > 0, "Your current balance is 0.");
        require(msg.sender == owner, "You are not owner!");
        address payable receiver = payable(transferAddress);
        receiver.transfer(amount);
        emit TransferSent(donorAddress,receiver,amount);
    }
    //add heplping method
    function getBalanceOf(address Address)public view returns(uint){
        return Address.balance;
    }
    //add heplping method
    function getBalanceContract()public view returns(uint){
        return donorAddress.balance;
    }
}