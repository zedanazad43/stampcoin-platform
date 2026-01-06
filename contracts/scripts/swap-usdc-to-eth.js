const { ethers } = require('ethers');
require('dotenv').config();

// المحفظة المصدر (لديها USDC)
const SOURCE_PRIVATE_KEY = '0x055474bc6b1280b9e696aeb947ebc944dd8c87876924cf10019cb78a895bd2a2';
// المحفظة الهدف (للنشر)
const TARGET_ADDRESS = '0xbf725439B03B9AB013200c6eF1E2d1Fb395F46fE';

// العناوين على Ethereum Mainnet
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const UNISWAP_ROUTER = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D'; // Uniswap V2 Router

const USDC_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)'
];

const ROUTER_ABI = [
  'function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] path, address to, uint deadline) returns (uint[] amounts)',
  'function getAmountsOut(uint amountIn, address[] path) view returns (uint[] amounts)'
];

async function swapUSDCtoETH() {
  console.log('🔄 بدء عملية التحويل...\n');
  
  const provider = new ethers.JsonRpcProvider('https://eth-mainnet.g.alchemy.com/v2/pJ_sssbIkfEg97fI696YZ');
  const wallet = new ethers.Wallet(SOURCE_PRIVATE_KEY, provider);
  
  console.log('📍 المحفظة المصدر:', wallet.address);
  console.log('🎯 المحفظة الهدف:', TARGET_ADDRESS);
  console.log('');
  
  // التحقق من الرصيد
  const usdc = new ethers.Contract(USDC_ADDRESS, USDC_ABI, wallet);
  const balance = await usdc.balanceOf(wallet.address);
  const balanceFormatted = ethers.formatUnits(balance, 6);
  
  console.log('💵 رصيد USDC:', balanceFormatted);
  
  // تحويل 5 USDC
  const amountToSwap = ethers.parseUnits('5', 6);
  
  console.log('📊 سنحوّل: 5 USDC → ETH\n');
  
  // الموافقة على Uniswap
  console.log('✅ الخطوة 1: الموافقة على Uniswap...');
  const allowance = await usdc.allowance(wallet.address, UNISWAP_ROUTER);
  
  if (allowance < amountToSwap) {
    const approveTx = await usdc.approve(UNISWAP_ROUTER, amountToSwap);
    console.log('⏳ معاملة الموافقة:', approveTx.hash);
    await approveTx.wait();
    console.log('✅ تمت الموافقة!\n');
  } else {
    console.log('✅ الموافقة موجودة بالفعل!\n');
  }
  
  // حساب كمية ETH المتوقعة
  const router = new ethers.Contract(UNISWAP_ROUTER, ROUTER_ABI, wallet);
  const path = [USDC_ADDRESS, WETH_ADDRESS];
  const amounts = await router.getAmountsOut(amountToSwap, path);
  const expectedETH = ethers.formatEther(amounts[1]);
  
  console.log('💰 ETH المتوقع:', expectedETH);
  console.log('');
  
  // التبديل
  console.log('🔄 الخطوة 2: تبديل USDC → ETH...');
  const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 دقيقة
  const amountOutMin = amounts[1] * 95n / 100n; // 5% slippage
  
  const swapTx = await router.swapExactTokensForETH(
    amountToSwap,
    amountOutMin,
    path,
    TARGET_ADDRESS, // إرسال مباشرة لمحفظة النشر
    deadline
  );
  
  console.log('⏳ معاملة التبديل:', swapTx.hash);
  const receipt = await swapTx.wait();
  console.log('✅ تم التبديل بنجاح!\n');
  
  // التحقق من الرصيد الجديد
  const newBalance = await provider.getBalance(TARGET_ADDRESS);
  console.log('🎉 رصيد ETH الجديد:', ethers.formatEther(newBalance), 'ETH');
  console.log('');
  console.log('✅ جاهز للنشر!');
}

swapUSDCtoETH().catch(console.error);
