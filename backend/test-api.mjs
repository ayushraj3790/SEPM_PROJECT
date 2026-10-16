const BASE_URL = "http://localhost:5000/api/v1";

let passed = 0;
let failed = 0;

function assert(condition, testName, details = "") {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${details ? "- " + details : ""}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n==============================================");
  console.log("   RUNNING BACKEND API INTEGRATION TESTS");
  console.log("==============================================\n");

  const timestamp = Date.now();
  const user1Data = {
    fullname: "Alice SEPM",
    username: `alice_${timestamp}`,
    email: `alice_${timestamp}@test.com`,
    password: "Password123!",
  };

  const user2Data = {
    fullname: "Bob SEPM",
    username: `bob_${timestamp}`,
    email: `bob_${timestamp}@test.com`,
    password: "Password123!",
  };

  let token1 = "";
  let token2 = "";
  let user1Id = "";
  let user2Id = "";
  let createdGroupId = "";
  let groupInviteCode = "";
  let storyId = "";

  // 1. User 1 Registration
  console.log("Test Suite: Authentication & User Management");
  try {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user1Data),
    });
    const data = await res.json();
    assert(res.status === 201 && data.success, "User 1 Registration", JSON.stringify(data));
    token1 = data.data?.accessToken;
    user1Id = data.data?.user?._id;
  } catch (err) {
    assert(false, "User 1 Registration exception", err.message);
  }

  // 2. Duplicate Registration Test
  try {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user1Data),
    });
    const data = await res.json();
    assert(res.status === 409, "Duplicate Registration Rejection (409)", `Status: ${res.status}`);
  } catch (err) {
    assert(false, "Duplicate Registration exception", err.message);
  }

  // 3. User 1 Login
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: user1Data.username,
        password: user1Data.password,
      }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success && data.data?.accessToken, "User 1 Login", JSON.stringify(data));
    if (data.data?.accessToken) token1 = data.data.accessToken;
  } catch (err) {
    assert(false, "User 1 Login exception", err.message);
  }

  // 4. Invalid Password Login Test
  try {
    const res = await fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identifier: user1Data.username,
        password: "WrongPassword999",
      }),
    });
    assert(res.status === 401, "Invalid Password Login Rejection (401)", `Status: ${res.status}`);
  } catch (err) {
    assert(false, "Invalid Password exception", err.message);
  }

  // 5. Get Current User (/user/me)
  try {
    const res = await fetch(`${BASE_URL}/user/me`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.data?._id === user1Id, "Get Current User Profile (/user/me)", JSON.stringify(data));
  } catch (err) {
    assert(false, "Get Current User exception", err.message);
  }

  // 6. User 2 Registration
  try {
    const res = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user2Data),
    });
    const data = await res.json();
    assert(res.status === 201 && data.success, "User 2 Registration", JSON.stringify(data));
    token2 = data.data?.accessToken;
    user2Id = data.data?.user?._id;
  } catch (err) {
    assert(false, "User 2 Registration exception", err.message);
  }

  // 7. User Profile by ID (/user/:userId/profile)
  try {
    const res = await fetch(`${BASE_URL}/user/${user2Id}/profile`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.data?.username === user2Data.username, "Get User Profile By ID", JSON.stringify(data));
  } catch (err) {
    assert(false, "Get User Profile exception", err.message);
  }

  console.log("\nTest Suite: Private Groups Management");

  // 8. Create Private Group (User 1)
  try {
    const res = await fetch(`${BASE_URL}/private-group/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        name: "SEPM Innovation Circle",
        description: "A private circle for testing group features",
      }),
    });
    const data = await res.json();
    assert(res.status === 201 && data.data?._id && data.data?.inviteCode, "Create Private Group", JSON.stringify(data));
    createdGroupId = data.data?._id;
    groupInviteCode = data.data?.inviteCode;
  } catch (err) {
    assert(false, "Create Private Group exception", err.message);
  }

  // 9. Create Group with missing name (Validation)
  try {
    const res = await fetch(`${BASE_URL}/private-group/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ name: "" }),
    });
    assert(res.status === 400, "Create Group Missing Name Rejection (400)", `Status: ${res.status}`);
  } catch (err) {
    assert(false, "Create Group Validation exception", err.message);
  }

  // 10. Get My Groups (User 1)
  try {
    const res = await fetch(`${BASE_URL}/private-group/my`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    const found = data.data?.some((g) => g._id === createdGroupId);
    assert(res.status === 200 && found, "Fetch My Groups (Contains Created Group)", `Total groups: ${data.data?.length}`);
  } catch (err) {
    assert(false, "Fetch My Groups exception", err.message);
  }

  // 11. Get Group Details (User 1)
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.data?.name === "SEPM Innovation Circle", "Get Group Details", JSON.stringify(data));
  } catch (err) {
    assert(false, "Get Group Details exception", err.message);
  }

  // 12. Join Private Group (User 2 via Invite Code)
  try {
    const res = await fetch(`${BASE_URL}/private-group/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({ inviteCode: groupInviteCode }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, "User 2 Joins Group via Invite Code", JSON.stringify(data));
  } catch (err) {
    assert(false, "Join Group exception", err.message);
  }

  // 13. Re-joining same group returns 400
  try {
    const res = await fetch(`${BASE_URL}/private-group/join`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token2}`,
      },
      body: JSON.stringify({ inviteCode: groupInviteCode }),
    });
    assert(res.status === 400, "Already Member Re-join Rejection (400)", `Status: ${res.status}`);
  } catch (err) {
    assert(false, "Re-join Group exception", err.message);
  }

  // 14. Verify Member in Group Details
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    const hasUser2 = data.data?.members?.some((m) => m.user_id === user2Id);
    assert(res.status === 200 && hasUser2, "Verify User 2 is in Group Members List", `Members: ${data.data?.members?.length}`);
  } catch (err) {
    assert(false, "Verify Member exception", err.message);
  }

  console.log("\nTest Suite: Stories / Memories Management");

  // 15. Post Text Story (User 1)
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        contentType: "text",
        title: "Sprint Planning Memory",
        text: "Today we completed the initial planning and tested all API endpoints successfully!",
        memoryDate: "2026-10-15",
      }),
    });
    const data = await res.json();
    assert(res.status === 201 && data.data?._id, "Post Text Story in Group", JSON.stringify(data));
    storyId = data.data?._id;
  } catch (err) {
    assert(false, "Post Story exception", err.message);
  }

  // 16. Post Story Validation (empty text for text story)
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({
        contentType: "text",
        title: "Invalid Empty Story",
        text: "",
      }),
    });
    assert(res.status === 400, "Post Text Story Missing Text Rejection (400)", `Status: ${res.status}`);
  } catch (err) {
    assert(false, "Post Story Validation exception", err.message);
  }

  // 17. Fetch Stories (User 2 fetching stories posted by User 1)
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}/stories?page=1&limit=10`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token2}` },
    });
    const data = await res.json();
    const foundStory = data.data?.stories?.some((s) => s._id === storyId);
    assert(res.status === 200 && foundStory, "User 2 Fetches Group Stories (Found User 1's story)", `Total stories: ${data.data?.stories?.length}`);
  } catch (err) {
    assert(false, "Fetch Stories exception", err.message);
  }

  // 18. Search Stories by Keyword (q="Sprint")
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}/stories?q=Sprint`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    const found = data.data?.stories?.some((s) => s.title.includes("Sprint"));
    assert(res.status === 200 && found, "Search Stories by keyword 'Sprint'", `Matched: ${data.data?.stories?.length}`);
  } catch (err) {
    assert(false, "Search Stories exception", err.message);
  }

  // 19. Search Groups
  try {
    const res = await fetch(`${BASE_URL}/private-group/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ query: "Innovation" }),
    });
    const data = await res.json();
    const found = data.data?.groups?.some((g) => g._id === createdGroupId);
    assert(res.status === 200 && found, "Search Groups by name query 'Innovation'", `Matched: ${data.data?.groups?.length}`);
  } catch (err) {
    assert(false, "Search Groups exception", err.message);
  }

  // 20. Update Group Details (Owner User 1)
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token1}`,
      },
      body: JSON.stringify({ description: "Updated description for test circle" }),
    });
    const data = await res.json();
    assert(res.status === 200 && data.data?.description === "Updated description for test circle", "Update Group Details (Owner)", JSON.stringify(data));
  } catch (err) {
    assert(false, "Update Group exception", err.message);
  }

  // 21. Delete Story
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}/stories/${storyId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, "Delete Story (by Author)", JSON.stringify(data));
  } catch (err) {
    assert(false, "Delete Story exception", err.message);
  }

  console.log("\nTest Suite: Member Departure & Group Cleanup");

  // 22. User 2 Leaves Group
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}/members/me`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token2}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, "User 2 Leaves Group", JSON.stringify(data));
  } catch (err) {
    assert(false, "Leave Group exception", err.message);
  }

  // 23. User 1 Deletes Group
  try {
    const res = await fetch(`${BASE_URL}/private-group/${createdGroupId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, "Delete Group (Owner)", JSON.stringify(data));
  } catch (err) {
    assert(false, "Delete Group exception", err.message);
  }

  // 24. Logout (User 1)
  try {
    const res = await fetch(`${BASE_URL}/user/logout`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token1}` },
    });
    const data = await res.json();
    assert(res.status === 200 && data.success, "User Logout", JSON.stringify(data));
  } catch (err) {
    assert(false, "User Logout exception", err.message);
  }

  console.log("\n==============================================");
  console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log("==============================================\n");

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
