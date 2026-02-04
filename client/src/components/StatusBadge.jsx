function StatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status) {
      case 'approved':
        return 'badge badge-approved';
      case 'denied':
        return 'badge badge-denied';
      case 'pending':
      default:
        return 'badge badge-pending';
    }
  };

  return <span className={getStatusClass()}>{status.toUpperCase()}</span>;
}

export default StatusBadge;
