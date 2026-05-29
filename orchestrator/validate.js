#!/usr/bin/env node

import { AgentOrchestrator } from "./agent-orchestrator.js";

const orchestrator = new AgentOrchestrator();

function formatResults(results) {
  const output = [];
  
  if (results.passed.length > 0) {
    output.push("\n✅ PASSED:");
    results.passed.forEach((msg) => output.push(`   ${msg}`));
  }

  if (results.warnings.length > 0) {
    output.push("\n⚠️  WARNINGS:");
    results.warnings.forEach((msg) => output.push(`   ${msg}`));
  }

  if (results.failed.length > 0) {
    output.push("\n❌ FAILED:");
    results.failed.forEach((msg) => output.push(`   ${msg}`));
  }

  return output.join("\n");
}

console.log("\n🎊 WEDDING PROJECT VALIDATION REPORT");
console.log("=====================================\n");

const report = orchestrator.validateAll();

Object.entries(report.agents).forEach(([agentId, results]) => {
  console.log(`\n📋 ${agentId.toUpperCase()}`);
  console.log("─".repeat(50));
  console.log(formatResults(results));
});

// Sumario final
console.log("\n\n📊 VALIDATION SUMMARY");
console.log("═".repeat(50));

let totalPassed = 0;
let totalWarnings = 0;
let totalFailed = 0;

Object.values(report.agents).forEach((results) => {
  totalPassed += results.passed.length;
  totalWarnings += results.warnings.length;
  totalFailed += results.failed.length;
});

console.log(`✅ Passed:  ${totalPassed}`);
console.log(`⚠️  Warnings: ${totalWarnings}`);
console.log(`❌ Failed:  ${totalFailed}`);

console.log("\n" + "═".repeat(50));

if (totalFailed === 0) {
  console.log("\n🎉 All validations passed!\n");
  process.exit(0);
} else {
  console.log(`\n⚠️  ${totalFailed} validation(s) failed. Please review.\n`);
  process.exit(1);
}
