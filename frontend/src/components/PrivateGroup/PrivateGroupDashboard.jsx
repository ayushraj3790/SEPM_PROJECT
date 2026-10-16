import { Link } from 'react-router-dom'
import { useEffect, useState, useCallback } from "react";
import axios from "../../utils/axios";
import { useAuth } from "../../utils/authContext";
import AddStory from './AddStory';
import CreateGroup from './CreateGroup';

// --- Icons ---
const GroupIcon = ({ isSelected }) => (
    <svg className={`w-5 h-5 mr-3 transition-colors ${isSelected ? 'text-white' : 'text-purple-400'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 9h2l-2 3h-2l-2-3h2V9z" />
    </svg>
);
const AddStoryIcon = () => (
    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path d="M11 3a1 1 0 10-2 0v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V3z" />
    </svg>
);
// Icon for Delete Button
const DeleteIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);
// Icon for Leave Group
const LeaveGroupIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    </svg>
);
// Icon for Copy
const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
    </svg>
);

// Join Group Form
const JoinGroupForm = ({ onGroupJoined }) => {
    const [inviteCode, setInviteCode] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        const trimmedCode = inviteCode.trim();
        if (!trimmedCode) { setError("Invite code cannot be empty."); return; }
        setIsSubmitting(true);
        try {
            await axios.post('/private-group/join', { inviteCode: trimmedCode });
            setSuccess("Successfully joined the group!");
            setInviteCode('');
            onGroupJoined();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to join group.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="glass-card-static p-5 mt-4">
            <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Join a Circle</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter invite code..."
                    className="input-field text-sm mb-3"
                    disabled={isSubmitting}
                    required
                />
                {error && (
                    <p className="text-xs mb-2 p-2 rounded-lg" style={{ color: "#fca5a5", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
                        {error}
                    </p>
                )}
                {success && (
                    <p className="text-xs mb-2 p-2 rounded-lg" style={{ color: "#86efac", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)" }}>
                        {success}
                    </p>
                )}
                <button
                    type="submit"
                    className="btn-primary w-full py-2.5 text-sm rounded-xl"
                    disabled={isSubmitting || !inviteCode.trim()}
                >
                    {isSubmitting ? 'Joining...' : 'Join Circle'}
                </button>
            </form>
        </div>
    );
};

// --- Main Component ---
export default function PrivateGroups() {
    const { auth, isAuthenticated } = useAuth();
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [stories, setStories] = useState([]);
    const [members, setMembers] = useState([]);
    const [isLoadingGroups, setIsLoadingGroups] = useState(true);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);
    const [error, setError] = useState(null);
    const [expandedDescriptions, setExpandedDescriptions] = useState({});
    const [showAddStoryModal, setShowAddStoryModal] = useState(false);
    const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
    const [selectedGroupOwnerId, setSelectedGroupOwnerId] = useState(null);
    const [selectedGroupInviteCode, setSelectedGroupInviteCode] = useState(null);
    const [copiedCode, setCopiedCode] = useState(null);

    const clearAllData = useCallback(() => {
        setGroups([]); setSelectedGroup(null); setStories([]); setMembers([]);
        setSelectedGroupOwnerId(null); setSelectedGroupInviteCode(null);
        setExpandedDescriptions({}); setError(null); setIsLoadingGroups(true); setIsFetchingDetails(false);
    }, []);

    const fetchGroupDetails = useCallback(async (groupId) => {
        if (!groupId) return;
        setSelectedGroup(groupId); setIsFetchingDetails(true); setStories([]); setMembers([]);
        setError(null); setSelectedGroupOwnerId(null); setSelectedGroupInviteCode(null);
        try {
            const [storyRes, detailRes] = await Promise.all([
                axios.get(`/private-group/${groupId}/stories`),
                axios.get(`/private-group/${groupId}`),
            ]);
            setStories(storyRes.data?.data?.stories || []);
            setMembers(detailRes.data?.data?.members || []);
            setSelectedGroupOwnerId(detailRes.data?.data?.createdBy);
            setSelectedGroupInviteCode(detailRes.data?.data?.inviteCode);
        } catch (err) {
            setError(`Failed to load data for group.`);
        } finally {
            setIsFetchingDetails(false);
        }
    }, []);

    const refreshStoryFeed = useCallback(() => {
        if (selectedGroup) fetchGroupDetails(selectedGroup);
    }, [selectedGroup, fetchGroupDetails]);

    const reFetchGroupsAndSelectFirst = useCallback(async () => {
        clearAllData();
        setIsLoadingGroups(true);
        try {
            const res = await axios.get("/private-group/my");
            const groupsData = res?.data?.data || [];
            setGroups(groupsData);
            if (groupsData.length > 0) await fetchGroupDetails(groupsData[0]._id);
        } catch (err) {
            setError("Failed to fetch your list of private groups.");
        } finally {
            setIsLoadingGroups(false);
        }
    }, [fetchGroupDetails, clearAllData]);

    useEffect(() => {
        if (isAuthenticated) reFetchGroupsAndSelectFirst();
        else clearAllData();
    }, [isAuthenticated, reFetchGroupsAndSelectFirst, clearAllData]);

    useEffect(() => { return () => clearAllData(); }, [clearAllData]);

    const copyInviteCode = async (code) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        } catch {
            const textArea = document.createElement('textarea');
            textArea.value = code;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopiedCode(code);
            setTimeout(() => setCopiedCode(null), 2000);
        }
    };

    const handleGroupClick = (groupId) => { if (selectedGroup !== groupId) fetchGroupDetails(groupId); };

    const handleDeleteGroup = async (groupId, groupName) => {
        if (!window.confirm(`Permanently delete "${groupName || 'this group'}"? This cannot be undone.`)) return;
        try { await axios.delete(`/private-group/${groupId}`); reFetchGroupsAndSelectFirst(); }
        catch { alert("Failed to delete. Only the owner can do this."); }
    };

    const handleLeaveGroup = async (groupId, groupName) => {
        if (!window.confirm(`Leave "${groupName || 'this group'}"? You'll need an invite to rejoin.`)) return;
        try { await axios.delete(`/private-group/${groupId}/members/me`); reFetchGroupsAndSelectFirst(); }
        catch { alert("Failed to leave. Owners must delete or transfer ownership."); }
    };

    const handleDeleteStory = async (storyId) => {
        if (!window.confirm("Delete this story? This cannot be undone.")) return;
        if (!selectedGroup) return;
        try { await axios.delete(`/private-group/${selectedGroup}/stories/${storyId}`); setStories(prev => prev.filter(s => s._id !== storyId)); }
        catch { alert("Failed to delete story."); }
    };

    const toggleDescription = (groupId) => setExpandedDescriptions(prev => ({ ...prev, [groupId]: !prev[groupId] }));

    if (!isAuthenticated) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 56px)", color: "var(--accent-light)" }}>
                Redirecting to authentication...
            </div>
        );
    }

    if (isLoadingGroups) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "calc(100vh - 56px)", gap: 12, color: "var(--accent-light)" }}>
                <svg style={{ width: 20, height: 20 }} className="animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Loading your circles...
            </div>
        );
    }

    const currentGroupName = groups.find(g => g._id === selectedGroup)?.name;

    const userHasDeletePermission = (story) => {
        const currentUserId = auth?.user?.user_id;
        const storyCreatorId = story.createdBy?.user_id;
        return currentUserId === storyCreatorId || String(currentUserId) === String(selectedGroupOwnerId);
    };

    return (
        <div style={{ display: "flex", height: "calc(100vh - 56px)", background: "var(--bg-primary)" }}>
            {/* Modals */}
            {showAddStoryModal && (
                <div className="modal-overlay">
                    <AddStory
                        privateGroupId={selectedGroup}
                        onClose={() => setShowAddStoryModal(false)}
                        onStoryAdded={() => { setShowAddStoryModal(false); refreshStoryFeed(); }}
                    />
                </div>
            )}
            {showCreateGroupModal && (
                <div className="modal-overlay">
                    <CreateGroup
                        onClose={() => setShowCreateGroupModal(false)}
                        onGroupCreated={() => { setShowCreateGroupModal(false); reFetchGroupsAndSelectFirst(); }}
                    />
                </div>
            )}

            {/* ── Left Sidebar ── */}
            <div className="w-[280px] flex-shrink-0 p-4 overflow-y-auto border-r" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)" }}>
                <div className="flex items-center justify-between mb-5 pb-3 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>Your Circles</h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "var(--accent-light)" }}>
                        {groups.length}
                    </span>
                </div>

                <div className="space-y-2 stagger-children">
                    {groups.length === 0 ? (
                        <div className="glass-card-static p-4 text-center">
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>No circles yet. Create or join one!</p>
                        </div>
                    ) : (
                        groups.map((group) => {
                            const isSelected = selectedGroup === group._id;
                            const isDescriptionExpanded = expandedDescriptions[group._id];
                            const shortDescription = group.description?.substring(0, 70);
                            const needsExpansion = group.description && group.description.length > 70;
                            const isGroupOwner = String(group.createdBy) === String(auth?.user?.user_id);
                            const isMember = group.members?.some(m => String(m.user_id) === String(auth?.user?.user_id));

                            return (
                                <div
                                    key={group._id}
                                    onClick={() => handleGroupClick(group._id)}
                                    className="cursor-pointer p-3 rounded-xl transition-all duration-200 animate-fade-in-up"
                                    style={{
                                        opacity: 0,
                                        background: isSelected
                                            ? "linear-gradient(135deg, var(--accent), #7c3aed)"
                                            : "var(--surface-glass)",
                                        border: `1px solid ${isSelected ? "transparent" : "var(--border-subtle)"}`,
                                        boxShadow: isSelected ? "0 4px 20px var(--accent-glow)" : "none",
                                    }}
                                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "var(--border-accent)"; }}
                                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center flex-1 min-w-0 pr-2">
                                            <GroupIcon isSelected={isSelected} />
                                            <p className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : ''}`}
                                               style={{ color: isSelected ? undefined : "var(--text-primary)" }}>
                                                {group.name}
                                            </p>
                                        </div>
                                        <div className="flex space-x-1 flex-shrink-0">
                                            {isGroupOwner && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group._id, group.name); }}
                                                    className="p-1 rounded-lg transition-colors cursor-pointer border-0"
                                                    style={{
                                                        background: isSelected ? "rgba(255,255,255,0.15)" : "rgba(239,68,68,0.1)",
                                                        color: isSelected ? "rgba(255,255,255,0.8)" : "#fca5a5",
                                                    }}
                                                    title={`Delete ${group.name}`}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            )}
                                            {!isGroupOwner && isMember && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleLeaveGroup(group._id, group.name); }}
                                                    className="p-1 rounded-lg transition-colors cursor-pointer border-0"
                                                    style={{
                                                        background: isSelected ? "rgba(255,255,255,0.15)" : "var(--surface-glass-strong)",
                                                        color: isSelected ? "rgba(255,255,255,0.8)" : "var(--text-muted)",
                                                    }}
                                                    title={`Leave ${group.name}`}
                                                >
                                                    <LeaveGroupIcon />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {group.description && (
                                        <p className="text-xs mt-1.5 leading-relaxed" style={{ color: isSelected ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
                                            {isDescriptionExpanded ? group.description : shortDescription}
                                            {needsExpansion && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); toggleDescription(group._id); }}
                                                    className="ml-1 text-xs font-medium bg-transparent border-0 cursor-pointer underline"
                                                    style={{ color: isSelected ? "rgba(255,255,255,0.9)" : "var(--accent-light)" }}
                                                >
                                                    {isDescriptionExpanded ? 'Less' : 'More'}
                                                </button>
                                            )}
                                        </p>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* ── Middle — Stories Feed ── */}
            <div className="flex-1 p-8 overflow-y-auto mesh-bg">
                <div className="flex justify-between items-center mb-8 pb-4 border-b" style={{ borderColor: "var(--border-subtle)" }}>
                    <div>
                        <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Stories</h2>
                        {selectedGroup && <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>{currentGroupName}</p>}
                    </div>
                    {selectedGroup && (
                        <button onClick={() => setShowAddStoryModal(true)} className="btn-primary inline-flex items-center text-sm px-5 py-2.5 rounded-xl">
                            <AddStoryIcon /> Add Story
                        </button>
                    )}
                </div>

                {isFetchingDetails ? (
                    <div className="text-center p-10 flex items-center justify-center gap-3" style={{ color: "var(--accent-light)" }}>
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Loading stories...
                    </div>
                ) : stories.length === 0 ? (
                    <div className="glass-card-static p-10 text-center mt-10">
                        <div className="text-4xl mb-4">{selectedGroup ? "📸" : "👈"}</div>
                        <p style={{ color: "var(--text-secondary)" }}>
                            {selectedGroup ? "No stories yet. Share your first memory!" : "Select a circle to view stories."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 stagger-children">
                        {stories.map((story) => {
                            const canDeleteStory = userHasDeletePermission(story);
                            return (
                                <div key={story._id} className="glass-card p-6 animate-fade-in-up" style={{ opacity: 0 }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <Link
                                            to={`/user/${story.createdBy?.user_id}`}
                                            className="flex items-center gap-3 no-underline group"
                                        >
                                            {story.createdBy?.profilePhoto ? (
                                                <img
                                                    src={story.createdBy.profilePhoto}
                                                    alt={story.createdBy?.fullname}
                                                    className="w-11 h-11 rounded-full object-cover"
                                                    style={{ border: "2px solid var(--border-accent)" }}
                                                />
                                            ) : (
                                                <div
                                                    className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                                                    style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-pink))", color: "white" }}
                                                >
                                                    {story.createdBy?.fullname?.charAt(0)?.toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-bold text-sm group-hover:underline" style={{ color: "var(--text-primary)" }}>
                                                    {story.createdBy?.fullname}
                                                </p>
                                                <p className="text-xs" style={{ color: "var(--accent-light)" }}>@{story.createdBy?.username}</p>
                                            </div>
                                        </Link>
                                        {canDeleteStory && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteStory(story._id)}
                                                    className="btn-danger text-xs px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                                                >
                                                    <DeleteIcon /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3">
                                        {story.contentType === "text" && (
                                            <p className="text-base leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{story.text}</p>
                                        )}
                                        {story.contentType === "image" && (
                                            <>
                                                {story.text && <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>{story.text}</p>}
                                                <img src={story.url} alt="story" className="rounded-xl mt-2 max-h-[500px] w-full object-contain" style={{ background: "var(--bg-card)", border: "1px solid var(--border-subtle)" }} />
                                            </>
                                        )}
                                        {story.contentType === "video" && (
                                            <>
                                                {story.text && <p className="mb-3 text-sm" style={{ color: "var(--text-secondary)" }}>{story.text}</p>}
                                                <video controls src={story.url} className="rounded-xl mt-2 w-full max-h-[500px]" style={{ background: "black" }} />
                                            </>
                                        )}
                                    </div>
                                    <p className="text-xs mt-4 text-right" style={{ color: "var(--text-muted)" }}>
                                        {new Date(story.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── Right Sidebar ── */}
            <div className="w-[300px] flex-shrink-0 p-5 overflow-y-auto border-l" style={{ background: "var(--bg-secondary)", borderColor: "var(--border-subtle)" }}>
                <h2 className="text-base font-bold mb-5 pb-3 border-b" style={{ color: "var(--text-primary)", borderColor: "var(--border-subtle)" }}>
                    Management
                </h2>

                {/* Create Group */}
                <div className="glass-card-static p-5 mb-4">
                    <p className="text-xs mb-3" style={{ color: "var(--text-secondary)" }}>Start a new private circle.</p>
                    <button onClick={() => setShowCreateGroupModal(true)} className="btn-primary w-full py-2.5 text-sm rounded-xl">
                        ➕ New Circle
                    </button>
                </div>

                {/* Join Group */}
                <JoinGroupForm onGroupJoined={reFetchGroupsAndSelectFirst} />

                {/* Invite Code */}
                {selectedGroup && selectedGroupInviteCode && (
                    <div className="glass-card-static p-5 mt-4">
                        <h3 className="text-sm font-bold mb-3" style={{ color: "var(--text-primary)" }}>Invite Code</h3>
                        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: "var(--surface-glass-strong)", border: "1px solid var(--border-accent)" }}>
                            <code className="text-sm font-mono font-bold" style={{ color: "var(--accent-light)" }}>
                                {selectedGroupInviteCode}
                            </code>
                            <button
                                onClick={() => copyInviteCode(selectedGroupInviteCode)}
                                className="flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer border-0"
                                style={{
                                    background: copiedCode === selectedGroupInviteCode ? "rgba(34,197,94,0.15)" : "rgba(139,92,246,0.15)",
                                    color: copiedCode === selectedGroupInviteCode ? "#86efac" : "var(--accent-light)",
                                }}
                            >
                                <CopyIcon />
                                {copiedCode === selectedGroupInviteCode ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                            Share this code to invite members.
                        </p>
                    </div>
                )}

                {/* Members */}
                <h3 className="text-sm font-bold mb-3 mt-6 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                    Members
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.15)", color: "var(--accent-light)" }}>
                        {isFetchingDetails ? '...' : members.length}
                    </span>
                </h3>
                <div className="space-y-2">
                    {members.length > 0 ? (
                        members.map((member) => (
                            <Link
                                key={member.user_id}
                                to={`/user/${member.user_id}`}
                                className="flex items-center gap-3 p-3 rounded-xl transition-all no-underline"
                                style={{ background: "var(--surface-glass)", border: "1px solid var(--border-subtle)" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-accent)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.transform = "none"; }}
                            >
                                {member.profilePhoto ? (
                                    <img src={member.profilePhoto} alt={member.fullname} className="w-9 h-9 rounded-full object-cover" style={{ border: "2px solid var(--border-accent)" }} />
                                ) : (
                                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "linear-gradient(135deg, var(--accent), var(--accent-pink))", color: "white" }}>
                                        {member.fullname?.charAt(0)?.toUpperCase()}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-xs truncate" style={{ color: "var(--text-primary)" }}>{member.fullname}</p>
                                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>@{member.username}</p>
                                </div>
                                <span className={member.role === 'owner' ? 'badge badge-owner' : 'badge badge-member'}>
                                    {member.role}
                                </span>
                            </Link>
                        ))
                    ) : (
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {selectedGroup ? (isFetchingDetails ? "Loading..." : "No members found.") : "Select a circle."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}