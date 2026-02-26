import { allComponents, presetBuilds } from '../data/components';

export function checkCompatibility(selectedComponents) {
    const issues = [];    // Critical incompatibilities (red)
    const warnings = [];  // Performance concerns (yellow)
    const strengths = []; // Good combinations (green)

    const { cpu, vga, mainboard, ram, psu, cooling, case: pcCase, ssd, hdd } = selectedComponents;

    // Count selected components
    const selectedCount = Object.values(selectedComponents).filter(Boolean).length;
    if (selectedCount < 2) {
        return { score: 0, issues: [], warnings: [], strengths: [], selectedCount };
    }

    // === CPU + Mainboard Socket Check ===
    if (cpu && mainboard) {
        if (cpu.socket !== mainboard.socket) {
            issues.push({
                type: 'critical',
                title: 'Incompatible Socket',
                detail: `CPU ${cpu.name} uses socket ${cpu.socket}, but mainboard ${mainboard.name} uses socket ${mainboard.socket}. These components are NOT compatible.`,
                components: ['cpu', 'mainboard'],
            });
        } else {
            strengths.push({
                title: 'Compatible Socket',
                detail: `Both CPU and Mainboard use socket ${cpu.socket}.`,
            });
        }
    }

    // === CPU + Mainboard RAM Type Check ===
    if (cpu && mainboard) {
        const cpuSupportsRamType = cpu.ramType.includes(mainboard.ramType);
        if (!cpuSupportsRamType) {
            issues.push({
                type: 'critical',
                title: 'Incompatible RAM Type',
                detail: `CPU ${cpu.name} supports ${cpu.ramType.join(', ')}, but mainboard ${mainboard.name} uses ${mainboard.ramType}.`,
                components: ['cpu', 'mainboard'],
            });
        }
    }

    // === RAM + Mainboard Compatibility ===
    if (ram && mainboard) {
        if (ram.type !== mainboard.ramType) {
            issues.push({
                type: 'critical',
                title: 'RAM incompatible with Mainboard',
                detail: `RAM ${ram.name} is ${ram.type}, but mainboard ${mainboard.name} only supports ${mainboard.ramType}.`,
                components: ['ram', 'mainboard'],
            });
        } else {
            strengths.push({
                title: 'Compatible RAM',
                detail: `RAM ${ram.type} is compatible with the mainboard.`,
            });
        }

        // Check RAM capacity vs mainboard max
        if (ram.capacity > mainboard.maxRam) {
            warnings.push({
                type: 'warning',
                title: 'RAM exceeds mainboard limit',
                detail: `RAM ${ram.capacity}GB exceeds the limit of ${mainboard.maxRam}GB for mainboard ${mainboard.name}.`,
                components: ['ram', 'mainboard'],
            });
        }

        // Check RAM sticks vs mainboard slots
        if (ram.sticks > mainboard.ramSlots) {
            issues.push({
                type: 'critical',
                title: 'Not enough RAM slots',
                detail: `RAM kit has ${ram.sticks} sticks but mainboard only has ${mainboard.ramSlots} slots.`,
                components: ['ram', 'mainboard'],
            });
        }
    }

    // === CPU + RAM Type Check ===
    if (cpu && ram) {
        if (!cpu.ramType.includes(ram.type)) {
            issues.push({
                type: 'critical',
                title: 'CPU does not support this RAM',
                detail: `CPU ${cpu.name} supports ${cpu.ramType.join(', ')}, but RAM is ${ram.type}.`,
                components: ['cpu', 'ram'],
            });
        }
    }

    // === PSU Wattage Check ===
    if (psu) {
        let estimatedTDP = 0;
        if (cpu) estimatedTDP += cpu.tdp;
        if (vga) estimatedTDP += vga.tdp;
        estimatedTDP += 50; // Other components

        const headroom = psu.wattage - estimatedTDP;
        const headroomPercent = (headroom / psu.wattage) * 100;

        if (headroom < 0) {
            issues.push({
                type: 'critical',
                title: 'Insufficient PSU wattage',
                detail: `Estimated system draw is ~${estimatedTDP}W, but PSU only provides ${psu.wattage}W. Short by ${Math.abs(headroom)}W!`,
                components: ['psu'],
            });
        } else if (headroomPercent < 20) {
            warnings.push({
                type: 'warning',
                title: 'PSU nearing max load',
                detail: `PSU is ${psu.wattage}W with estimated draw ${estimatedTDP}W (~${Math.round((estimatedTDP / psu.wattage) * 100)}% load). Consider a higher wattage PSU.`,
                components: ['psu'],
            });
        } else {
            strengths.push({
                title: 'Sufficient PSU wattage',
                detail: `PSU ${psu.wattage}W is sufficient for system ~${estimatedTDP}W (${Math.round(headroomPercent)}% headroom).`,
            });
        }

        // GPU recommended PSU check
        if (vga && psu.wattage < vga.recommendedPSU) {
            warnings.push({
                type: 'warning',
                title: 'PSU below GPU recommendation',
                detail: `${vga.name} recommends at least ${vga.recommendedPSU}W, but PSU only has ${psu.wattage}W.`,
                components: ['psu', 'vga'],
            });
        }
    }

    // === Cooling + CPU TDP Check ===
    if (cooling && cpu) {
        if (cooling.tdpSupport < cpu.tdp) {
            warnings.push({
                type: 'warning',
                title: 'Potential overheating',
                detail: `Cooler ${cooling.name} supports ${cooling.tdpSupport}W TDP, CPU draws ${cpu.tdp}W. Thermal throttling may occur under full load.`,
                components: ['cooling', 'cpu'],
            });
        } else {
            strengths.push({
                title: 'Adequate Cooling',
                detail: `${cooling.name} (${cooling.tdpSupport}W) provides adequate cooling for ${cpu.name} (${cpu.tdp}W TDP).`,
            });
        }

        // Socket compatibility
        if (cooling.sockets && !cooling.sockets.includes(cpu.socket)) {
            issues.push({
                type: 'critical',
                title: 'Cooler incompatible with CPU socket',
                detail: `${cooling.name} does not support CPU socket ${cpu.socket}.`,
                components: ['cooling', 'cpu'],
            });
        }
    }

    // === Case + Mainboard Form Factor ===
    if (pcCase && mainboard) {
        if (!pcCase.formFactor.includes(mainboard.formFactor)) {
            issues.push({
                type: 'critical',
                title: 'Mainboard too large for Case',
                detail: `Case ${pcCase.name} supports ${pcCase.formFactor.join(', ')}, but mainboard ${mainboard.name} is ${mainboard.formFactor}.`,
                components: ['case', 'mainboard'],
            });
        } else {
            strengths.push({
                title: 'Compatible Form Factor',
                detail: `Case supports mainboard form factor ${mainboard.formFactor}.`,
            });
        }
    }

    // === Case + GPU Length ===
    if (pcCase && vga) {
        if (vga.length > pcCase.maxGPULength) {
            issues.push({
                type: 'critical',
                title: 'GPU too long for Case',
                detail: `${vga.name} is ${vga.length}mm long, case max GPU clearance is ${pcCase.maxGPULength}mm.`,
                components: ['case', 'vga'],
            });
        } else {
            const clearance = pcCase.maxGPULength - vga.length;
            if (clearance < 20) {
                warnings.push({
                    type: 'warning',
                    title: 'Tight GPU clearance',
                    detail: `GPU is ${vga.length}mm long, case max is ${pcCase.maxGPULength}mm. Only ${clearance}mm clearance left.`,
                    components: ['case', 'vga'],
                });
            }
        }
    }

    // === Case + Cooler Height ===
    if (pcCase && cooling && cooling.height) {
        if (cooling.height > pcCase.maxCoolerHeight) {
            issues.push({
                type: 'critical',
                title: 'Cooler too tall for Case',
                detail: `${cooling.name} is ${cooling.height}mm tall, case max clearance is ${pcCase.maxCoolerHeight}mm.`,
                components: ['case', 'cooling'],
            });
        }
    }

    // === Case + AIO Radiator ===
    if (pcCase && cooling && cooling.radiatorSize) {
        if (!pcCase.radiatorSupport.includes(cooling.radiatorSize)) {
            issues.push({
                type: 'critical',
                title: 'Case does not support radiator',
                detail: `Case ${pcCase.name} supports ${pcCase.radiatorSupport.join('/')}mm radiators, but ${cooling.name} is ${cooling.radiatorSize}mm.`,
                components: ['case', 'cooling'],
            });
        }
    }

    // === SSD + Mainboard M.2 Slots ===
    if (ssd && mainboard && ssd.type === 'NVMe M.2') {
        if (mainboard.m2Slots === 0) {
            issues.push({
                type: 'critical',
                title: 'Mainboard has no M.2 slots',
                detail: `Mainboard ${mainboard.name} does not have M.2 slots for NVMe SSD.`,
                components: ['ssd', 'mainboard'],
            });
        } else {
            strengths.push({
                title: 'Compatible M.2 SSD',
                detail: `Mainboard has ${mainboard.m2Slots} M.2 slots.`,
            });
        }
    }

    // === Performance Balance Warnings ===
    if (cpu && vga) {
        const tierOrder = ['budget', 'mid', 'mid-high', 'high', 'ultra'];
        const cpuTierIdx = tierOrder.indexOf(cpu.tier);
        const vgaTierIdx = tierOrder.indexOf(vga.tier);
        const tierDiff = Math.abs(cpuTierIdx - vgaTierIdx);

        if (tierDiff >= 2) {
            if (cpuTierIdx > vgaTierIdx) {
                warnings.push({
                    type: 'warning',
                    title: 'GPU Bottleneck',
                    detail: `CPU tier "${cpu.tier}" is significantly stronger than GPU tier "${vga.tier}". GPU may hold back gaming performance.`,
                    components: ['cpu', 'vga'],
                });
            } else {
                warnings.push({
                    type: 'warning',
                    title: 'CPU Bottleneck',
                    detail: `GPU tier "${vga.tier}" is significantly stronger than CPU tier "${cpu.tier}". CPU may bottleneck the system.`,
                    components: ['cpu', 'vga'],
                });
            }
        } else if (tierDiff <= 1) {
            strengths.push({
                title: 'Balanced CPU/GPU',
                detail: `CPU and GPU are in similar tiers, offering balanced performance.`,
            });
        }
    }

    const totalPrice = calculateTotalPrice(selectedComponents);
    const score = calculateScore(issues, warnings, strengths, selectedCount, totalPrice, selectedComponents);

    return { score, issues, warnings, strengths, selectedCount };
}

function checkIsPresetMatch(selectedComponents) {
    for (const category of presetBuilds) {
        for (const preset of category.items) {
            let match = true;
            for (const compType in preset.components) {
                if (preset.components[compType]) {
                    if (!selectedComponents[compType] || selectedComponents[compType].id !== preset.components[compType]) {
                        match = false;
                        break;
                    }
                }
            }
            if (match) return true;
        }
    }
    return false;
}

function calculateScore(issues, warnings, strengths, selectedCount, totalPrice, selectedComponents) {
    if (selectedCount < 2) return 0;

    const isMatched = checkIsPresetMatch(selectedComponents);

    if (isMatched) {
        return 95;
    }

    let baseScore = 80;

    if (totalPrice >= 60000000) {
        baseScore = 95;
    } else if (totalPrice > 40000000) {
        baseScore = 90;
    } else if (totalPrice > 20000000) {
        baseScore = 85;
    }

    let score = baseScore;

    // Critical issues reduce score heavily
    score -= issues.length * 25;

    // Warnings reduce score moderately
    score -= warnings.length * 8;

    // Strengths add small bonus
    score += strengths.length * 3;

    // Bonus for more components selected
    score += Math.min(selectedCount * 2, 10);

    // Clamp
    return Math.max(0, Math.min(95, Math.round(score)));
}

export function getSmartSuggestions(selectedComponents, allComponents) {
    const suggestions = [];
    const { cpu, vga, mainboard, ram, psu, cooling } = selectedComponents;

    // Suggest mainboard based on CPU
    if (cpu && !mainboard) {
        const compatibleBoards = allComponents.mainboard.filter(
            mb => mb.socket === cpu.socket && cpu.ramType.includes(mb.ramType)
        );
        if (compatibleBoards.length > 0) {
            suggestions.push({
                category: 'mainboard',
                title: 'Suggested Mainboard',
                detail: `Based on CPU ${cpu.name} (${cpu.socket})`,
                items: compatibleBoards.slice(0, 3),
            });
        }
    }

    // Suggest RAM based on mainboard
    if (mainboard && !ram) {
        const compatibleRam = allComponents.ram.filter(r => r.type === mainboard.ramType);
        if (compatibleRam.length > 0) {
            suggestions.push({
                category: 'ram',
                title: 'Suggested RAM',
                detail: `Mainboard supports ${mainboard.ramType}`,
                items: compatibleRam.slice(0, 3),
            });
        }
    }

    // Suggest PSU based on CPU + GPU
    if ((cpu || vga) && !psu) {
        let estimatedTDP = 50;
        if (cpu) estimatedTDP += cpu.tdp;
        if (vga) estimatedTDP += vga.tdp;
        const recommendedWattage = Math.ceil(estimatedTDP * 1.3 / 50) * 50;

        const suitablePSUs = allComponents.psu.filter(p => p.wattage >= recommendedWattage);
        if (suitablePSUs.length > 0) {
            suggestions.push({
                category: 'psu',
                title: 'Suggested PSU',
                detail: `System draws ~${estimatedTDP}W, recommended ≥${recommendedWattage}W`,
                items: suitablePSUs.slice(0, 3),
            });
        }
    }

    // Suggest cooling based on CPU
    if (cpu && !cooling) {
        const suitableCoolers = allComponents.cooling.filter(
            c => c.tdpSupport >= cpu.tdp && c.sockets.includes(cpu.socket)
        );
        if (suitableCoolers.length > 0) {
            suggestions.push({
                category: 'cooling',
                title: 'Suggested Cooler',
                detail: `CPU ${cpu.name} has ${cpu.tdp}W TDP`,
                items: suitableCoolers.slice(0, 3),
            });
        }
    }

    // Suggest GPU based on CPU tier
    if (cpu && !vga) {
        const tierOrder = ['budget', 'mid', 'mid-high', 'high', 'ultra'];
        const cpuTierIdx = tierOrder.indexOf(cpu.tier);
        const balancedTiers = tierOrder.slice(Math.max(0, cpuTierIdx - 1), cpuTierIdx + 2);
        const balancedGPUs = allComponents.vga.filter(g => balancedTiers.includes(g.tier));
        if (balancedGPUs.length > 0) {
            suggestions.push({
                category: 'vga',
                title: 'Suggested GPU',
                detail: `Balanced with CPU tier "${cpu.tier}"`,
                items: balancedGPUs.slice(0, 3),
            });
        }
    }

    return suggestions;
}

export function formatPrice(price) {
    return new Intl.NumberFormat('en-US').format(price) + ' VND';
}

export function calculateTotalPrice(selectedComponents) {
    return Object.values(selectedComponents)
        .filter(Boolean)
        .reduce((total, component) => total + (component.price || 0), 0);
}
