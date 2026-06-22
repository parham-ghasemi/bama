import { useState, useEffect } from 'react';
import api from '../../../../lib/axiosConfig';
import { toast } from 'sonner';

const formatNumber = (value: string): string => {
  if (!value) return '';
  const num = parseInt(value, 10);
  return isNaN(num) ? '' : num.toLocaleString('en-US');
};

const Card = ({ balance }: { balance: number | null }) => {
  if (balance === null) return <div className="min-w-md h-56 rounded-2xl flex items-center justify-center">در حال بارگذاری...</div>;

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
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    api.get('/user/balance').then(res => {
      setBalance(res.data.balance);
    }).catch(err => {
      console.error(err);
      toast.error('خطا در بارگذاری موجودی');
    });
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(rawValue)) {
      setAmount(formatNumber(rawValue));
    }
  };

  const handleDeposit = () => {
    if (amount) {
      const numAmount = parseInt(amount.replace(/,/g, ''), 10);
      api.post('/user/deposit', { amount: numAmount }).then(res => {
        setBalance(res.data.balance);
        setAmount('');
        toast.success('واریز成功');
      }).catch(err => {
        console.error(err);
        toast.error('خطا در واریز');
      });
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
            className="rounded w-45 py-2 bg-blue-600 text-neutral-50 mt-5 cursor-pointer hover:bg-blue-500 text-[16px]"
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