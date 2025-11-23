import UsersTable from '../../components/tables/UsersTable';

const Users = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">مدیریت کاربران</h2>
      <UsersTable />
    </div>
  );
};

export default Users;