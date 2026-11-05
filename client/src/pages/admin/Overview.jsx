import { useEffect, useState } from "react";
import { api } from "../../api.js";
import { useTheme } from "../../theme.jsx";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, ComposedChart, Line, RadialBarChart, RadialBar, Legend, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
const COL = ["#0a84ff", "#ff8a00", "#38bdf8", "#4ade80", "#a78bfa", "#f472b6", "#facc15", "#fb7185"];
const palette = dark => ({ tip: { contentStyle: { background: dark ? "#0b1437" : "#ffffff", border: `1px solid ${dark ? "#2a3b7a" : "#cfd8f3"}`, borderRadius: 10, color: dark ? "#e8eeff" : "#0b1437" } }, axis: { stroke: dark ? "#93a1c9" : "#55658f", fontSize: 11 }, grid: dark ? "#1b2a5e" : "#dfe6f7", polar: dark ? "#2a3b7a" : "#cfd8f3", lbl: dark ? "#fff" : "#0b1437" });
const Box = ({ title, children, h = 280 }) => <div className="card chart"><h4>{title}</h4><div style={{ height: h }}>{children}</div></div>;

export default function Overview() {
  const { theme } = useTheme(), { tip, axis, grid, polar, lbl } = palette(theme === "dark");
  const [d, setD] = useState(null);
  useEffect(() => { api("/analytics", { auth: true }).then(setD).catch(() => setD(false)); }, []);
  if (d === false) return <p className="msg err">Could not load analytics. Please refresh.</p>;
  if (!d) return <p className="dim">Loading analytics…</p>;
  const cnt = s => d.byStatus.find(x => x._id === s)?.count || 0;
  const pct = n => (d.total ? Math.round((n / d.total) * 100) : 0);
  const status = d.byStatus.map(x => ({ name: x._id, value: x.count }));
  const svc = d.byService.map(x => ({ name: x._id, count: x.count }));
  const emailTotal = d.emails.sent + d.emails.failed;
  const radial = [
    { name: "Closed", value: pct(cnt("closed")), fill: "#4ade80" },
    { name: "Contacted", value: pct(cnt("contacted") + cnt("in-progress") + cnt("closed")), fill: "#0a84ff" },
    { name: "Email success", value: emailTotal ? Math.round((d.emails.sent / emailTotal) * 100) : 0, fill: "#ff8a00" }
  ];
  const kpi = [["Total Enquiries", d.total], ["New", cnt("new")], ["Emails Sent", d.emails.sent], ["Projects", d.projects], ["Close Rate", pct(cnt("closed")) + "%"]];
  return (
    <>
      <div className="stats">{kpi.map(([l, v]) => <div className="card" key={l}><span>{l}</span><b>{v}</b></div>)}</div>
      <div className="cgrid">
        <Box title="Enquiries & emails · last 30 days (Area)" h={300}>
          <ResponsiveContainer><AreaChart data={d.daily}>
            <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#0a84ff" stopOpacity={.6} /><stop offset="95%" stopColor="#0a84ff" stopOpacity={0} /></linearGradient></defs>
            <CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis dataKey="date" {...axis} interval={4} /><YAxis allowDecimals={false} {...axis} /><Tooltip {...tip} /><Legend />
            <Area type="monotone" dataKey="leads" name="Enquiries" stroke="#0a84ff" fill="url(#g1)" strokeWidth={2} />
            <Area type="monotone" dataKey="emails" name="Emails" stroke="#ff8a00" fill="#ff8a0030" strokeWidth={2} />
          </AreaChart></ResponsiveContainer>
        </Box>
        <Box title="Status distribution (Donut)">
          <ResponsiveContainer><PieChart><Pie data={status} dataKey="value" nameKey="name" innerRadius={60} outerRadius={95} paddingAngle={3} label>{status.map((_, i) => <Cell key={i} fill={COL[i % COL.length]} />)}</Pie><Tooltip {...tip} /><Legend /></PieChart></ResponsiveContainer>
        </Box>
        <Box title="Top requested services (Bar)">
          <ResponsiveContainer><BarChart data={svc} layout="vertical" margin={{ left: 30 }}><CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis type="number" allowDecimals={false} {...axis} /><YAxis type="category" dataKey="name" width={130} {...axis} /><Tooltip {...tip} /><Bar dataKey="count" radius={[0, 6, 6, 0]}>{svc.map((_, i) => <Cell key={i} fill={COL[i % COL.length]} />)}</Bar></BarChart></ResponsiveContainer>
        </Box>
        <Box title="Service demand (Radar)">
          <ResponsiveContainer><RadarChart data={svc}><PolarGrid stroke={polar} /><PolarAngleAxis dataKey="name" {...axis} /><Radar dataKey="count" stroke="#ff8a00" fill="#ff8a00" fillOpacity={.45} /><Tooltip {...tip} /></RadarChart></ResponsiveContainer>
        </Box>
        <Box title="Monthly enquiries vs emails (Bar + Line)">
          <ResponsiveContainer><ComposedChart data={d.monthly}><CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis dataKey="month" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip {...tip} /><Legend />
            <Bar dataKey="leads" name="Enquiries" fill="#0a84ff" radius={[6, 6, 0, 0]} /><Line type="monotone" dataKey="emails" name="Emails" stroke="#ff8a00" strokeWidth={3} dot={{ r: 4 }} /></ComposedChart></ResponsiveContainer>
        </Box>
        <Box title="Busiest weekdays (Column)">
          <ResponsiveContainer><BarChart data={d.weekday}><CartesianGrid stroke={grid} strokeDasharray="3 3" /><XAxis dataKey="day" {...axis} /><YAxis allowDecimals={false} {...axis} /><Tooltip {...tip} /><Bar dataKey="count" name="Enquiries" radius={[6, 6, 0, 0]}>{d.weekday.map((_, i) => <Cell key={i} fill={COL[i % COL.length]} />)}</Bar></BarChart></ResponsiveContainer>
        </Box>
        <Box title="Performance rates % (Radial)">
          <ResponsiveContainer><RadialBarChart innerRadius="25%" outerRadius="100%" data={radial} startAngle={90} endAngle={-270}><RadialBar dataKey="value" background cornerRadius={8} label={{ fill: lbl, fontSize: 11 }} /><Legend iconSize={10} /><Tooltip {...tip} /></RadialBarChart></ResponsiveContainer>
        </Box>
      </div>
    </>
  );
}
