export function Tabs({ tabs, selectedTab, setSelectedTab, ...props }) {
    return (
        <div className="flex gap-7">
            {
                tabs.map(item =>
                    <span
                        className={`${selectedTab === item.id ? "text-amber-400 font-bold" : "text-zinc-50"} text-2xl cursor-pointer hover:opacity-70`}
                        onClick={() => setSelectedTab(item.id)}
                    >
                        {item.label}
                    </span>
                )
            }
        </div>
    )
}