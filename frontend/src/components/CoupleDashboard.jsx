import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const CoupleDashboard = () => {
  const navigate = useNavigate();
  const [user] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });
  const [activeTab, setActiveTab] = useState('checklist');
  const [bookings, setBookings] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [budget, setBudget] = useState({ total: 15000, spent: 0 });
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState(null);
  const [newTask, setNewTask] = useState({ task: '', category: 'planning', dueDate: '', estimatedCost: 0 });
  const [editForm, setEditForm] = useState({ task: '', dueDate: '', estimatedCost: 0 });
  const [vendorForm, setVendorForm] = useState({
    vendorName: '',
    type: 'planner',
    date: '',
    totalAmount: 0,
    paidAmount: 0,
    status: 'pending',
    notes: ''
  });

  const initializeChecklist = () => {
    const defaultTasks = [
      { id: 1, task: "Set wedding budget", category: "planning", completed: true, dueDate: "2026-01-15", estimatedCost: 0, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 2, task: "Create guest list", category: "planning", completed: false, dueDate: "2026-03-01", estimatedCost: 0, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 3, task: "Book ceremony venue", category: "venues", completed: false, dueDate: "2026-04-15", estimatedCost: 5000, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 4, task: "Hire wedding photographer", category: "photography", completed: false, dueDate: "2026-05-01", estimatedCost: 1500, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 5, task: "Book makeup artist", category: "beauty", completed: false, dueDate: "2026-05-15", estimatedCost: 350, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 6, task: "Book catering service", category: "catering", completed: false, dueDate: "2026-06-01", estimatedCost: 2500, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 7, task: "Hire wedding planner", category: "planning", completed: false, dueDate: "2026-03-15", estimatedCost: 1000, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 8, task: "Book DJ or band", category: "entertainment", completed: false, dueDate: "2026-06-15", estimatedCost: 800, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 9, task: "Order wedding cake", category: "catering", completed: false, dueDate: "2026-07-01", estimatedCost: 300, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 10, task: "Buy wedding dress", category: "attire", completed: false, dueDate: "2026-05-30", estimatedCost: 1200, paidAmount: 0, vendorId: null, vendorName: null },
      { id: 11, task: "Plan honeymoon", category: "honeymoon", completed: false, dueDate: "2026-08-01", estimatedCost: 3000, paidAmount: 0, vendorId: null, vendorName: null }
    ];

    setChecklist(defaultTasks);
    localStorage.setItem('wedding_checklist', JSON.stringify(defaultTasks));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const timer = setTimeout(() => {
      const savedChecklist = localStorage.getItem('wedding_checklist');
      const savedBookings = localStorage.getItem('wedding_bookings');
      const savedBudget = localStorage.getItem('wedding_budget');

      if (savedChecklist) {
        setChecklist(JSON.parse(savedChecklist));
      } else {
        initializeChecklist();
      }

      if (savedBookings) {
        const parsedBookings = JSON.parse(savedBookings);
        setBookings(parsedBookings);
        const bookingSpent = parsedBookings.reduce((sum, booking) => sum + (booking.paidAmount || 0), 0);
        setBudget(prev => ({ ...prev, spent: bookingSpent }));
      } else {
        setBookings([]);
      }

      if (savedBudget) {
        setBudget(prev => ({ ...prev, total: Number(savedBudget) || prev.total }));
      }

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [navigate]);

  const saveChecklist = (updatedChecklist) => {
    setChecklist(updatedChecklist);
    localStorage.setItem('wedding_checklist', JSON.stringify(updatedChecklist));
  };

  const toggleTask = (taskId) => {
    const updated = checklist.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveChecklist(updated);
  };

  const startEditing = (task) => {
    setEditingTask(task.id);
    setEditForm({
      task: task.task,
      dueDate: task.dueDate,
      estimatedCost: task.estimatedCost
    });
  };

  const saveEdit = (taskId) => {
    const updated = checklist.map(task => 
      task.id === taskId ? { ...task, ...editForm } : task
    );
    saveChecklist(updated);
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Remove this task from your checklist?')) {
      const updated = checklist.filter(task => task.id !== taskId);
      saveChecklist(updated);
    }
  };

  const addTask = () => {
    if (!newTask.task.trim()) {
      alert('Please enter a task name');
      return;
    }
    
    const taskToAdd = {
      id: Date.now(),
      ...newTask,
      completed: false,
      paidAmount: 0,
      vendorId: null,
      vendorName: null
    };
    
    saveChecklist([...checklist, taskToAdd]);
    setShowAddTaskModal(false);
    setNewTask({ task: '', category: 'planning', dueDate: '', estimatedCost: 0 });
  };

  const openPaymentModal = (task) => {
    setSelectedPayment(task);
    const remaining = Math.max((task.estimatedCost || task.totalAmount || 0) - (task.paidAmount || 0), 0);
    setPaymentAmount(remaining);
    setShowPaymentModal(true);
  };

  const processPayment = (amount) => {
    if (!selectedPayment || !amount || amount <= 0) {
      alert('Please enter a valid payment amount.');
      return;
    }

    if (selectedPayment.source === 'booking') {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedPayment.id
          ? {
              ...booking,
              paidAmount: Math.min((booking.paidAmount || 0) + amount, booking.totalAmount || 0),
              status: (booking.paidAmount || 0) + amount >= (booking.totalAmount || 0) ? 'confirmed' : booking.status
            }
          : booking
      );
      setBookings(updatedBookings);
      localStorage.setItem('wedding_bookings', JSON.stringify(updatedBookings));
      const bookingSpent = updatedBookings.reduce((sum, booking) => sum + (booking.paidAmount || 0), 0);
      setBudget(prev => ({ ...prev, spent: bookingSpent }));
    } else {
      const updated = checklist.map(task =>
        task.id === selectedPayment.id
          ? { ...task, paidAmount: (task.paidAmount || 0) + amount, completed: true }
          : task
      );
      saveChecklist(updated);
    }

    setShowPaymentModal(false);
    setSelectedPayment(null);
    setPaymentAmount(0);
    alert(`Payment of $${amount} processed successfully`);
  };

  const saveBudget = () => {
    localStorage.setItem('wedding_budget', String(budget.total));
    setShowBudgetModal(false);
  };

  const openAddVendorModal = () => {
    setEditingVendorId(null);
    setVendorForm({
      vendorName: '',
      type: 'planner',
      date: '',
      totalAmount: 0,
      paidAmount: 0,
      status: 'pending',
      notes: ''
    });
    setShowVendorModal(true);
  };

  const openEditVendorModal = (vendor) => {
    setEditingVendorId(vendor.id);
    setVendorForm({
      vendorName: vendor.vendorName || '',
      type: vendor.type || 'planner',
      date: vendor.date || '',
      totalAmount: vendor.totalAmount || 0,
      paidAmount: vendor.paidAmount || 0,
      status: vendor.status || 'pending',
      notes: vendor.notes || ''
    });
    setShowVendorModal(true);
  };

  const saveVendor = () => {
    if (!vendorForm.vendorName.trim()) {
      alert('Vendor name is required.');
      return;
    }

    const updatedBookings = editingVendorId
      ? bookings.map((booking) =>
          booking.id === editingVendorId ? { ...booking, ...vendorForm, totalAmount: Number(vendorForm.totalAmount) || 0, paidAmount: Number(vendorForm.paidAmount) || 0 } : booking
        )
      : [
          ...bookings,
          {
            id: bookings.length > 0 ? Math.max(...bookings.map((booking) => Number(booking.id) || 0)) + 1 : 1,
            ...vendorForm,
            totalAmount: Number(vendorForm.totalAmount) || 0,
            paidAmount: Number(vendorForm.paidAmount) || 0
          }
        ];

    setBookings(updatedBookings);
    localStorage.setItem('wedding_bookings', JSON.stringify(updatedBookings));
    const bookingSpent = updatedBookings.reduce((sum, booking) => sum + (booking.paidAmount || 0), 0);
    setBudget(prev => ({ ...prev, spent: bookingSpent }));
    setShowVendorModal(false);
  };

  const getTotalCost = () => {
    return checklist.reduce((sum, task) => sum + (task.estimatedCost || 0), 0);
  };

  const getTotalPaid = () => {
    return checklist.reduce((sum, task) => sum + (task.paidAmount || 0), 0);
  };

  const getCategoryName = (category) => {
    const names = {
      planning: 'Planning',
      venues: 'Venues',
      photography: 'Photography',
      beauty: 'Beauty',
      catering: 'Catering',
      entertainment: 'Entertainment',
      attire: 'Attire',
      honeymoon: 'Honeymoon'
    };
    return names[category] || category;
  };

  if (loading) {
    return <div className="loading-screen">Loading your wedding dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>My Wedding Planner</h2>
          <p>Welcome, {user?.name || 'Couple'}</p>
        </div>
        
        <nav className="sidebar-nav">
          <button className={activeTab === 'checklist' ? 'active' : ''} onClick={() => setActiveTab('checklist')}>
            Wedding Checklist
          </button>
          <button className={activeTab === 'vendors' ? 'active' : ''} onClick={() => setActiveTab('vendors')}>
            Selected Vendors
          </button>
          <button className={activeTab === 'payments' ? 'active' : ''} onClick={() => setActiveTab('payments')}>
            Payments
          </button>
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h1>Wedding Dashboard</h1>
          <div className="wedding-date">
            Wedding in Progress
          </div>
        </div>

        {activeTab === 'checklist' && (
          <div className="dashboard-content">
            <div className="checklist-header">
              <h2>Wedding Checklist</h2>
              <button className="btn-secondary" onClick={() => setShowAddTaskModal(true)}>Add Custom Task</button>
            </div>
            <div className="dashboard-action-row">
              <button className="btn-primary" onClick={() => setShowBudgetModal(true)}>Select Budget</button>
              <button className="btn-secondary" onClick={openAddVendorModal}>Add Vendor</button>
              <button className="btn-secondary" onClick={() => setActiveTab('vendors')}>Edit Vendor List</button>
            </div>

            <div className="checklist-summary">
              <div className="summary-item">Total Budget: <strong>${getTotalCost().toLocaleString()}</strong></div>
              <div className="summary-item">Paid: <strong className="text-success">${getTotalPaid().toLocaleString()}</strong></div>
              <div className="summary-item">Remaining: <strong className="text-warning">${(getTotalCost() - getTotalPaid()).toLocaleString()}</strong></div>
            </div>

            {['planning', 'venues', 'photography', 'beauty', 'catering', 'entertainment', 'attire', 'honeymoon'].map(category => {
              const categoryTasks = checklist.filter(t => t.category === category);
              if (categoryTasks.length === 0) return null;
              
              return (
                <div key={category} className="checklist-category">
                  <h3>{getCategoryName(category)}</h3>
                  {categoryTasks.map(task => (
                    <div key={task.id} className={`checklist-item ${task.completed ? 'completed' : ''}`}>
                      {editingTask === task.id ? (
                        <div className="edit-mode">
                          <input 
                            type="text" 
                            value={editForm.task} 
                            onChange={(e) => setEditForm({ ...editForm, task: e.target.value })}
                            className="edit-input"
                          />
                          <input 
                            type="date" 
                            value={editForm.dueDate} 
                            onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                            className="edit-input"
                          />
                          <input 
                            type="number" 
                            value={editForm.estimatedCost} 
                            onChange={(e) => setEditForm({ ...editForm, estimatedCost: parseInt(e.target.value) || 0 })}
                            className="edit-input"
                            placeholder="Cost"
                          />
                          <button className="save-btn-small" onClick={() => saveEdit(task.id)}>Save</button>
                          <button className="cancel-btn-small" onClick={() => setEditingTask(null)}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <div className="task-info">
                            <input 
                              type="checkbox" 
                              checked={task.completed} 
                              onChange={() => toggleTask(task.id)}
                            />
                            <div className="task-details">
                              <span className="task-name">{task.task}</span>
                              {task.dueDate && <span className="task-date">Due: {task.dueDate}</span>}
                              {task.vendorName && <span className="task-vendor">Vendor: {task.vendorName}</span>}
                            </div>
                            <div className="task-cost">
                              {task.estimatedCost > 0 && <span>${task.estimatedCost}</span>}
                              {task.paidAmount > 0 && <span className="paid-badge">Paid: ${task.paidAmount}</span>}
                            </div>
                          </div>
                          <div className="task-actions">
                            <button className="edit-btn" onClick={() => startEditing(task)}>Edit</button>
                            {task.estimatedCost > 0 && task.paidAmount < task.estimatedCost && (
                              <button className="pay-btn" onClick={() => openPaymentModal(task)}>Pay</button>
                            )}
                            <button className="delete-btn" onClick={() => deleteTask(task.id)}>Delete</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'vendors' && (
          <div className="dashboard-content">
            <h2>Selected Vendors</h2>
            {bookings.length === 0 ? (
              <div className="empty-state">
                <p>You haven't selected any vendors yet.</p>
                <button className="btn-primary" onClick={() => navigate('/services/makeup')}>Browse Services</button>
              </div>
            ) : (
              <div className="vendors-grid">
                {bookings.map(vendor => (
                  <div key={vendor.id} className="vendor-card">
                    <div className="vendor-header">
                      <h3>{vendor.vendorName}</h3>
                    </div>
                    <div className="vendor-body">
                      <p>Service: {vendor.type}</p>
                      <p>Date: {vendor.date}</p>
                      <p>Total: ${vendor.totalAmount}</p>
                      <p>Paid: ${vendor.paidAmount || 0}</p>
                      <p>Remaining: ${(vendor.totalAmount - (vendor.paidAmount || 0))}</p>
                    </div>
                    <div className="vendor-footer">
                      <span className={`status ${vendor.status}`}>{vendor.status}</span>
                      <div className="vendor-actions">
                        <button className="edit-btn" onClick={() => openEditVendorModal(vendor)}>Edit Vendor</button>
                        <button className="pay-btn" onClick={() => openPaymentModal({ ...vendor, source: 'booking' })}>Booking Payment</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="dashboard-content">
            <h2>Payment History</h2>
            <table className="payments-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Task / Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {checklist.filter(t => t.paidAmount > 0).map(task => (
                  <tr key={task.id}>
                    <td>{new Date().toLocaleDateString()}</td>
                    <td>{task.task}</td>
                    <td>${task.paidAmount}</td>
                    <td><span className="status confirmed">Paid</span></td>
                  </tr>
                ))}
                {checklist.filter(t => t.paidAmount > 0).length === 0 && (
                  <tr>
                    <td colSpan="4" className="empty-row">No payments recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Make Payment</h2>
            <div className="payment-details">
              <p><strong>Task:</strong> {selectedPayment.task || selectedPayment.vendorName}</p>
              <p><strong>Total Amount:</strong> ${selectedPayment.estimatedCost || selectedPayment.totalAmount || 0}</p>
              <p><strong>Already Paid:</strong> ${selectedPayment.paidAmount}</p>
              <p><strong>Remaining:</strong> ${(selectedPayment.estimatedCost || selectedPayment.totalAmount || 0) - (selectedPayment.paidAmount || 0)}</p>
            </div>
            <div className="form-group">
              <label>Amount to Pay</label>
              <input 
                type="number" 
                className="payment-input"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseInt(e.target.value, 10) || 0)}
                max={(selectedPayment.estimatedCost || selectedPayment.totalAmount || 0) - (selectedPayment.paidAmount || 0)}
                min="1"
              />
            </div>
            <div className="form-group">
              <label>Payment Method</label>
              <select className="payment-select">
                <option>Credit Card</option>
                <option>Mobile Money</option>
                <option>Bank Transfer</option>
                <option>Cash</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={() => processPayment(paymentAmount)}>
                Confirm Payment
              </button>
              <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showBudgetModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Select Wedding Budget</h2>
            <div className="budget-presets">
              {[10000, 15000, 20000, 30000, 50000].map((preset) => (
                <button key={preset} className="btn-secondary" onClick={() => setBudget(prev => ({ ...prev, total: preset }))}>
                  ${preset.toLocaleString()}
                </button>
              ))}
            </div>
            <div className="form-group">
              <label>Custom Budget</label>
              <input
                type="number"
                value={budget.total}
                onChange={(e) => setBudget(prev => ({ ...prev, total: parseInt(e.target.value, 10) || 0 }))}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={saveBudget}>Save Budget</button>
              <button className="btn-secondary" onClick={() => setShowBudgetModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showVendorModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>{editingVendorId ? 'Edit Vendor' : 'Add Vendor'}</h2>
            <div className="form-group">
              <label>Vendor Name</label>
              <input type="text" value={vendorForm.vendorName} onChange={(e) => setVendorForm({ ...vendorForm, vendorName: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Service Type</label>
              <select value={vendorForm.type} onChange={(e) => setVendorForm({ ...vendorForm, type: e.target.value })}>
                <option value="planner">Planner</option>
                <option value="venue">Venue</option>
                <option value="photographer">Photographer</option>
                <option value="makeup_artist">Makeup Artist</option>
                <option value="catering">Catering</option>
                <option value="musician">Musician</option>
              </select>
            </div>
            <div className="form-group">
              <label>Booking Date</label>
              <input type="date" value={vendorForm.date} onChange={(e) => setVendorForm({ ...vendorForm, date: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Total Amount</label>
              <input type="number" value={vendorForm.totalAmount} onChange={(e) => setVendorForm({ ...vendorForm, totalAmount: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="form-group">
              <label>Paid Amount</label>
              <input type="number" value={vendorForm.paidAmount} onChange={(e) => setVendorForm({ ...vendorForm, paidAmount: parseInt(e.target.value, 10) || 0 })} />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={vendorForm.status} onChange={(e) => setVendorForm({ ...vendorForm, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={saveVendor}>{editingVendorId ? 'Save Vendor' : 'Add Vendor'}</button>
              <button className="btn-secondary" onClick={() => setShowVendorModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <h2>Add Custom Task</h2>
            <div className="form-group">
              <label>Task Name</label>
              <input 
                type="text" 
                value={newTask.task} 
                onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                placeholder="Example: Order wedding cake"
              />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}>
                <option value="planning">Planning</option>
                <option value="venues">Venues</option>
                <option value="photography">Photography</option>
                <option value="beauty">Beauty</option>
                <option value="catering">Catering</option>
                <option value="entertainment">Entertainment</option>
                <option value="attire">Attire</option>
                <option value="honeymoon">Honeymoon</option>
              </select>
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input 
                type="date" 
                value={newTask.dueDate} 
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Estimated Cost (USD)</label>
              <input 
                type="number" 
                value={newTask.estimatedCost} 
                onChange={(e) => setNewTask({ ...newTask, estimatedCost: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-primary" onClick={addTask}>Add Task</button>
              <button className="btn-secondary" onClick={() => setShowAddTaskModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoupleDashboard;