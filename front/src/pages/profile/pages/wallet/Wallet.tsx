import { useState } from 'react';

const formatNumber = (value: string): string => {
  if (!value) return '';
  const num = parseInt(value, 10);
  return isNaN(num) ? '' : num.toLocaleString('en-US');
};

const Card = ({ balance }: { balance: number }) => {
  return (
    <div className="min-w-md h-56 rounded-2xl flex items-center justify-center relative overflow-hidden">
      <div className="absolute wallet-card-bg -top-16 -left-2 -right-24 -bottom-28" />

      <p className="text-white/70 absolute top-5 right-6 text-xl">Bama.com</p>

      <p className="text-white left-6 absolute bottom-6 font-bold text-sm">{balance.toLocaleString('en-US')} تومان</p>
      <p className="text-white right-6 absolute bottom-6 font-bold text-sm">موجودی کیف پول</p>
    </div>
  )
}

const Wallet = () => {
  const [amount, setAmount] = useState('');
  const [balance, setBalance] = useState(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(rawValue)) {
      setAmount(formatNumber(rawValue));
    }
  };

  const handleDeposit = () => {
    if (amount) {
      const numAmount = parseInt(amount.replace(/,/g, ''), 10);
      setBalance(prev => prev + numAmount);
      setAmount('');
    }
  };

  return (
    <div>
      <h2 className="font-semibold text-xl">کیف پول </h2>

      <div className="shadow w-full  rounded-lg border mt-10 shadow-neutral-300 border-neutral-200 flex items-center p-8 justify-between gap-16">
        <div className="w-full">
          <p className="font-semibold">افزایش موجودی کیف پول </p>
          <p className="text-xs text-neutral-500 mt-3">با شارژ موجودی حساب خود می‌توانید با سرعت و سهولت بیشتری خرید کنید.  </p>

          <div className="w-full grid grid-cols-3 mt-6 gap-4 ">
            <button
              className="text-xs border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-100 transition ease-in-out h-10"
              onClick={() => setAmount(formatNumber('50000'))}
            >
              50,000 تومان
            </button>
            <button
              className="text-xs border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-100 transition ease-in-out h-10"
              onClick={() => setAmount(formatNumber('100000'))}
            >
              100,000 تومان
            </button>
            <button
              className="text-xs border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-100 transition ease-in-out h-10"
              onClick={() => setAmount(formatNumber('150000'))}
            >
              150,000 تومان
            </button>

            <input
              type="text"
              className="border border-neutral-300 rounded-lg text-xs h-10 col-span-3 px-6 py-2"
              placeholder="مبلغ به تومان"
              value={amount}
              onChange={handleAmountChange}
            />
          </div>

          <button
            className="rounded w-24 py-2 bg-neutral-400 text-neutral-50 mt-5 cursor-pointer hover:bg-neutral-500"
            onClick={handleDeposit}
          >
            واریز
          </button>
        </div>
        <Card balance={balance} />
      </div>
    </div>
  )
}

export default Wallet