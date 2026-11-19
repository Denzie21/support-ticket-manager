import type {
  Customer,
  Ticket,
  TicketStatus,
  TicketPriority
} from "../types";

interface DashboardAnalyticsProps {
  customers: Customer[];
  tickets: Ticket[];
}

interface MonthlyTicketCount {
  key: string;
  label: string;
  count: number;
}

export function DashboardAnalytics({
  customers,
  tickets
}: DashboardAnalyticsProps) {
  // ==========================================
  // TICKET STATUS COUNTS
  // ==========================================

  const statusCounts: Record<TicketStatus, number> = {
    open: tickets.filter((ticket) => ticket.status === "open").length,
    in_progress: tickets.filter(
      (ticket) => ticket.status === "in_progress"
    ).length,
    resolved: tickets.filter(
      (ticket) => ticket.status === "resolved"
    ).length,
    closed: tickets.filter((ticket) => ticket.status === "closed").length
  };

  // ==========================================
  // TICKET PRIORITY COUNTS
  // ==========================================

  const priorityCounts: Record<TicketPriority, number> = {
    low: tickets.filter((ticket) => ticket.priority === "low").length,
    medium: tickets.filter((ticket) => ticket.priority === "medium").length,
    high: tickets.filter((ticket) => ticket.priority === "high").length,
    urgent: tickets.filter((ticket) => ticket.priority === "urgent").length
  };

  // ==========================================
  // PERFORMANCE METRICS
  // ==========================================

  const unresolvedTickets =
    statusCounts.open + statusCounts.in_progress;

  const completedTickets =
    statusCounts.resolved + statusCounts.closed;

  const resolutionRate =
    tickets.length > 0
      ? (completedTickets / tickets.length) * 100
      : 0;


  // ==========================================
  // MONTHLY TICKET TRENDS
  // ==========================================

  const currentDate = new Date();

  const monthlyTickets: MonthlyTicketCount[] = Array.from(
    { length: 6 },
    (_, index) => {
      const monthDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - (5 - index),
        1
      );

      const year = monthDate.getFullYear();
      const month = String(monthDate.getMonth() + 1).padStart(2, "0");
      const monthKey = `${year}-${month}`;

      const count = tickets.filter((ticket) => {
        // Use the year and month portion of the database date.
        // This avoids unnecessary timezone changes to the month.
        const createdMonth = ticket.created_at?.slice(0, 7);
        return createdMonth === monthKey;
      }).length;

      return {
        key: monthKey,
        label: monthDate.toLocaleDateString("en-US", {
          month: "short"
        }),
        count
      };
    }
  );

  const highestMonthlyCount = Math.max(
    ...monthlyTickets.map((month) => month.count),
    1
  );

  // ==========================================
  // HIGH-PRIORITY TICKET MONITORING
  // ==========================================

  const attentionTickets = tickets
    .filter(
      (ticket) =>
        (ticket.priority === "urgent" ||
          ticket.priority === "high") &&
        ticket.status !== "resolved" &&
        ticket.status !== "closed"
    )
    .sort((a, b) => {
      // Urgent tickets appear before high-priority tickets.
      if (a.priority !== b.priority) {
        return a.priority === "urgent" ? -1 : 1;
      }

      // Within the same priority, show newest tickets first.
      return (
        new Date(b.created_at).getTime() -
        new Date(a.created_at).getTime()
      );
    });

  // ==========================================
  // STATUS AND PRIORITY DISPLAY DATA
  // ==========================================

  const statusItems: {
    label: string;
    value: number;
    className: string;
  }[] = [
      {
        label: "Open",
        value: statusCounts.open,
        className: "status-open"
      },
      {
        label: "In Progress",
        value: statusCounts.in_progress,
        className: "status-in-progress"
      },
      {
        label: "Resolved",
        value: statusCounts.resolved,
        className: "status-resolved"
      },
      {
        label: "Closed",
        value: statusCounts.closed,
        className: "status-closed"
      }
    ];

  const priorityItems: {
    label: string;
    value: number;
    className: string;
  }[] = [
      {
        label: "Low",
        value: priorityCounts.low,
        className: "priority-low"
      },
      {
        label: "Medium",
        value: priorityCounts.medium,
        className: "priority-medium"
      },
      {
        label: "High",
        value: priorityCounts.high,
        className: "priority-high"
      },
      {
        label: "Urgent",
        value: priorityCounts.urgent,
        className: "priority-urgent"
      }
    ];

  return (
    <section className="analytics-section">
      <div className="analytics-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h2>Dashboard Analytics</h2>
          <p>Monitor your customers and support ticket activity.</p>
        </div>
      </div>

      {/* ======================================
          SUMMARY CARDS
      ====================================== */}

      <div className="analytics-grid">
        <article className="analytics-card">
          <span className="analytics-card-label">
            Total Customers
          </span>
          <strong className="analytics-card-value">
            {customers.length}
          </strong>
          <span className="analytics-card-description">
            Registered customers
          </span>
        </article>

        <article className="analytics-card">
          <span className="analytics-card-label">
            Total Tickets
          </span>
          <strong className="analytics-card-value">
            {tickets.length}
          </strong>
          <span className="analytics-card-description">
            All support tickets
          </span>
        </article>

        <article className="analytics-card">
          <span className="analytics-card-label">
            Unresolved Tickets
          </span>
          <strong className="analytics-card-value">
            {unresolvedTickets}
          </strong>
          <span className="analytics-card-description">
            Open and in-progress tickets
          </span>
        </article>

        <article className="analytics-card">
          <span className="analytics-card-label">
            Resolution Rate
          </span>
          <strong className="analytics-card-value">
            {resolutionRate.toFixed(1)}%
          </strong>
          <span className="analytics-card-description">
            Resolved and closed tickets
          </span>
        </article>
      </div>

      {/* ======================================
          MONTHLY TICKET TRENDS
      ====================================== */}

      <article className="analytics-panel monthly-trends-panel">
        <h3>Monthly Ticket Trends</h3>
        <p className="analytics-panel-description">
          Tickets created during the last six months.
        </p>

        <div className="monthly-chart">
          {monthlyTickets.map((month) => {
            const barHeight =
              (month.count / highestMonthlyCount) * 100;

            return (
              <div className="monthly-chart-column" key={month.key}>
                <strong className="monthly-chart-value">
                  {month.count}
                </strong>

                <div className="monthly-chart-bar-area">
                  <div
                    className="monthly-chart-bar"
                    style={{
                      height: `${barHeight}%`,
                      minHeight: month.count > 0 ? "6px" : "0"
                    }}
                    title={`${month.count} tickets created`}
                  />
                </div>

                <span className="monthly-chart-label">
                  {month.label}
                </span>
              </div>
            );
          })}
        </div>
      </article>

      {/* ======================================
          TICKET STATUS AND PRIORITY BREAKDOWN
      ====================================== */}

      <div className="analytics-breakdown-grid">
        <article className="analytics-panel">
          <h3>Ticket Status Breakdown</h3>
          <p className="analytics-panel-description">
            Current distribution of support tickets.
          </p>

          <div className="analytics-list">
            {statusItems.map((item) => {
              const percentage =
                tickets.length > 0
                  ? (item.value / tickets.length) * 100
                  : 0;

              return (
                <div className="analytics-list-item" key={item.label}>
                  <div className="analytics-list-heading">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>

                  <div className="analytics-progress-track">
                    <div
                      className={`analytics-progress-fill ${item.className}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>

        <article className="analytics-panel">
          <h3>Ticket Priority Breakdown</h3>
          <p className="analytics-panel-description">
            Distribution of tickets by priority level.
          </p>

          <div className="analytics-list">
            {priorityItems.map((item) => {
              const percentage =
                tickets.length > 0
                  ? (item.value / tickets.length) * 100
                  : 0;

              return (
                <div className="analytics-list-item" key={item.label}>
                  <div className="analytics-list-heading">
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                  </div>

                  <div className="analytics-progress-track">
                    <div
                      className={`analytics-progress-fill ${item.className}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </div>

      {/* ======================================
          HIGH-PRIORITY TICKET MONITORING
      ====================================== */}

      <article className="analytics-panel attention-panel">
        <div className="attention-panel-header">
          <div>
            <h3>Tickets Requiring Attention</h3>
            <p className="analytics-panel-description">
              Active urgent and high-priority tickets.
            </p>
          </div>

          <span className="attention-count">
            {attentionTickets.length}
          </span>
        </div>

        {attentionTickets.length > 0 ? (
          <div className="attention-ticket-list">
            {attentionTickets.map((ticket) => (
              <div className="attention-ticket" key={ticket.id}>
                <div className="attention-ticket-info">
                  <strong>{ticket.subject}</strong>
                  <span>
                    Ticket #{ticket.id} · Customer #{ticket.customer_id}
                  </span>
                </div>

                <div className="attention-ticket-labels">
                  <span
                    className={`attention-priority ${ticket.priority}`}
                  >
                    {ticket.priority.toUpperCase()}
                  </span>

                  <span className="attention-ticket-status">
                    {ticket.status.replace("_", " ")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="analytics-empty-message">
            No active high-priority or urgent tickets. Great work!
          </p>
        )}
      </article>
    </section>
  );
}